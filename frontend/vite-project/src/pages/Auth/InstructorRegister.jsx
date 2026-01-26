import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/axiosInstance.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Upload } from "lucide-react";

export default function InstructorRegister() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const [documentPreview, setDocumentPreview] = useState(null);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Handle PDF Upload to Cloudinary
  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type (only PDF)
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    setDocumentPreview(file.name);
    setIsUploading(true);

    // Create FormData for Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "learnvault/instructor-documents");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setUploadedDocumentUrl(data.secure_url);
        console.log("✅ Document uploaded:", data.secure_url);
      } else {
        alert("Failed to upload document");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading document");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!uploadedDocumentUrl) {
      alert("Please upload your instructor documents");
      return;
    }

    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        documents: uploadedDocumentUrl, // Cloudinary URL
      };

      const res = await api.post("/auth/register-instructor", payload);

      if (res.data.token) {
        loginContext(res.data.user, res.data.token);
        alert("✅ " + res.data.message);
        navigate("/instructor");
        reset();
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 py-12 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Become an Instructor
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Share your expertise and start teaching on LearnVault
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Password *
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Instructor Verification Document (PDF) *
            </label>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Upload a PDF containing:
            </p>
            <ul className="text-gray-600 dark:text-gray-400 text-sm mb-4 list-disc list-inside space-y-1">
              <li>Your professional background and introduction</li>
              <li>Proof of expertise (certificates, degrees, credentials)</li>
              <li>Years of experience in your field</li>
              <li>Contact details (email, phone, LinkedIn)</li>
            </ul>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-800">
              <input
                type="file"
                accept=".pdf"
                onChange={handleDocumentUpload}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Click to upload PDF
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  PDF up to 5MB
                </span>
              </label>

              {documentPreview && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-green-700 dark:text-green-400 text-sm">
                    ✓ {documentPreview}
                  </p>
                </div>
              )}

              {isUploading && (
                <div className="mt-4">
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    Uploading...
                  </p>
                </div>
              )}
            </div>

            {uploadedDocumentUrl && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  ✓ Document uploaded successfully
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Submit Application"}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-700 dark:text-blue-400 text-sm">
            <strong>ℹ️ What happens next?</strong> Our admin team will review your documents and verify your credentials. You'll receive an email within 1-3 business days with the result.
          </p>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-black dark:text-white font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
