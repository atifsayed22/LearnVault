import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function CourseCertificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificate();
  }, [courseId]);

  const loadCertificate = async () => {
    try {
      const res = await api.get(`/progress/course/${courseId}/certificate`);
      setCertificate(res.data.certificate);
    } catch (err) {
      const message = err.response?.data?.message || "Certificate is not available yet";
      toast.error(message);
      navigate(`/student/course/${courseId}/learn`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // Open certificate in a new window for printing
    const printWindow = window.open('', '', 'width=1000,height=700');
    const printContent = document.querySelector('.print-area').innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * { margin: 0; padding: 0; }
            body { font-family: system-ui, -apple-system, sans-serif; background: white; }
            .print-area { padding: 20px; }
            @media print {
              body { margin: 0; padding: 0; }
              .print-area { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-area">
            ${printContent}
          </div>
          <script>
            setTimeout(() => window.print(), 100);
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const issuedDate = certificate?.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString()
    : "";

  if (loading) {
    return <div className="p-10 text-white">Loading certificate...</div>;
  }

  if (!certificate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 ">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
          }
          .print-hide { display: none !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="print-hide mb-5 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            Back
          </button>
          <button
            onClick={handlePrint}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
          >
            Download / Print
          </button>
        </div>

        <div className="print-area rounded-2xl bg-white p-4 sm:p-8 text-slate-900 shadow-2xl">
          <div className="rounded-xl border-[10px] border-amber-200 p-6 sm:p-10">
            <div className="text-center">
              <p className="text-xs sm:text-sm tracking-[0.35em] text-slate-500">LEARNVAULT</p>
              <h1 className="mt-4 text-3xl sm:text-5xl font-black">Certificate of Completion</h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                This certificate is proudly presented to
              </p>

              <p className="mt-6 text-2xl sm:text-4xl font-bold text-slate-900 border-b-2 border-dashed border-slate-300 inline-block px-4 pb-2">
                {certificate.studentName}
              </p>

              <p className="mt-6 text-sm sm:text-base text-slate-700">
                for successfully completing the course
              </p>
              <p className="mt-3 text-xl sm:text-3xl font-semibold text-amber-700">
                {certificate.courseTitle}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <p className="text-xs uppercase text-slate-500">Instructor</p>
                <p className="text-sm sm:text-base font-semibold mt-1">{certificate.instructorName}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Issued On</p>
                <p className="text-sm sm:text-base font-semibold mt-1">{issuedDate}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Certificate ID</p>
                <p className="text-sm sm:text-base font-semibold mt-1">{certificate.certificateId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
