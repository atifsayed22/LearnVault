import nodemailer from "nodemailer";

// Check if email credentials are configured (silent check, only warn if missing)
const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
if (!emailConfigured && process.env.NODE_ENV !== 'test') {
  console.warn("⚠️ WARNING: Email service not configured. Email features will be disabled.");
  console.warn("   EMAIL_USER:", process.env.EMAIL_USER ? "✓ Set" : "❌ Missing");
  console.warn("   EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "✓ Set" : "❌ Missing");
}

// Create transporter function (lazy initialization)
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,      // Your Gmail address
        pass: process.env.EMAIL_PASSWORD   // Your Gmail app password (NOT regular password)
      }
    });
  }
  return transporter;
}

// Function to send instructor approval email
export const sendApprovalEmail = async (instructorEmail, instructorName) => {
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: instructorEmail,
      subject: "🎉 Welcome! Your Instructor Profile Has Been Verified",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to LearnVault, ${instructorName}!</h2>
          
          <p style="color: #666; font-size: 16px;">
            Great news! Your instructor application has been <strong>approved</strong> by our admin team.
          </p>
          
          <p style="color: #666; font-size: 16px;">
            Your profile has been verified and you can now start creating courses.
          </p>
          
          <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-left: 4px solid #333;">
            <h3 style="margin-top: 0; color: #333;">What's Next?</h3>
            <ul style="color: #666;">
              <li>Log in to your dashboard</li>
              <li>Click "Create New Course"</li>
              <li>Add course details, sections, and lessons</li>
              <li>Publish your course when ready</li>
              <li>Start earning from your courses</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 16px;">
            <a href="${process.env.FRONTEND_URL}/instructor/create-course" 
               style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Creating Courses
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px;">
            If you have any questions, contact our support team at support@learnvault.com
          </p>
          
          <p style="color: #999; font-size: 14px;">
            Best regards,<br>
            <strong>LearnVault Team</strong>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email sent to ${instructorEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending approval email: ${error.message}`);
    throw error;
  }
};

// Function to send instructor rejection email
export const sendRejectionEmail = async (instructorEmail, instructorName, rejectionReason) => {
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: instructorEmail,
      subject: "Instructor Application Update - LearnVault",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Application Review - ${instructorName}</h2>
          
          <p style="color: #666; font-size: 16px;">
            Thank you for applying to become an instructor on LearnVault.
          </p>
          
          <p style="color: #666; font-size: 16px;">
            After reviewing your submitted documents, we are unable to approve your application at this time.
          </p>
          
          <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ff9800; border-radius: 3px;">
            <h3 style="margin-top: 0; color: #333;">Reason for Rejection:</h3>
            <p style="color: #666; margin: 0;">
              ${rejectionReason}
            </p>
          </div>
          
          <h3 style="color: #333;">What Can You Do?</h3>
          <p style="color: #666; font-size: 16px;">
            You can reapply with updated documents that meet our requirements. Please ensure your PDF includes:
          </p>
          <ul style="color: #666; font-size: 16px;">
            <li>Clear personal introduction and professional background</li>
            <li>Proof of expertise (certificates, degrees, credentials)</li>
            <li>Detailed work experience and years in the field</li>
            <li>Complete contact details (email, phone, LinkedIn)</li>
          </ul>
          
          <p style="color: #666; font-size: 16px;">
            <a href="${process.env.FRONTEND_URL}/auth/register" 
               style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reapply as Instructor
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px;">
            If you believe this is a mistake or have questions, contact our support team at support@learnvault.com
          </p>
          
          <p style="color: #999; font-size: 14px;">
            Best regards,<br>
            <strong>LearnVault Team</strong>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Rejection email sent to ${instructorEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending rejection email: ${error.message}`);
    throw error;
  }
};

// Function to send pending application notification (optional)
export const sendApplicationReceivedEmail = async (instructorEmail, instructorName) => {
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: instructorEmail,
      subject: "Instructor Application Received - LearnVault",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You, ${instructorName}!</h2>
          
          <p style="color: #666; font-size: 16px;">
            We have received your instructor application.
          </p>
          
          <p style="color: #666; font-size: 16px;">
            Our admin team will review your documents and verify your credentials. This typically takes 1-3 business days.
          </p>
          
          <div style="background-color: #e8f5e9; padding: 15px; margin: 20px 0; border-left: 4px solid #4caf50; border-radius: 3px;">
            <p style="color: #333; margin: 0;">
              ✓ We will send you an email as soon as your profile has been verified.
            </p>
          </div>
          
          <p style="color: #666; font-size: 16px;">
            In the meantime, you can browse courses and enroll as a student.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px;">
            If you have any questions, contact us at support@learnvault.com
          </p>
          
          <p style="color: #999; font-size: 14px;">
            Best regards,<br>
            <strong>LearnVault Team</strong>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Application received email sent to ${instructorEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending application received email: ${error.message}`);
    throw error;
  }
};

export default { sendApprovalEmail, sendRejectionEmail, sendApplicationReceivedEmail };
