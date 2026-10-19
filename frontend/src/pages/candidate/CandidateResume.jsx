import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FileTextIcon, UploadIcon, EyeIcon, TrashIcon, Loader2Icon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";

export default function CandidateResume() {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchResume = async () => {
    try {
      const { data } = await API.get("/resumes/me");
      setResume(data.resume);
    } catch {
      setResume(null);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file to upload");

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    try {
      const { data } = await API.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResume(data.resume);
      setFile(null);
      toast.success("Resume uploaded & parsed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error uploading resume");
    } finally {
      setUploading(false);
    }
  };

  const handleView = () => {
    const targetUrl = resume?.resumeUrl || resume?.fileUrl;
    if (targetUrl) {
      const finalHref = targetUrl.startsWith("http")
        ? targetUrl
        : `http://localhost:8000/${targetUrl}`;
      window.open(finalHref, "_blank", "noopener,noreferrer");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your uploaded resume?");
    if (!confirm) return;

    setDeleting(true);
    try {
      await API.delete("/resumes/me");
      setResume(null);
      toast.info("Resume removed successfully");
    } catch {
      toast.error("Error deleting resume");
    } finally {
      setDeleting(false);
    }
  };

  const fileName = resume?.resumeUrl
    ? resume.resumeUrl.split("/").pop()
    : resume?.fileUrl
    ? resume.fileUrl.split("/").pop()
    : "Uploaded_Resume.pdf";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          My Resume
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Upload your resume in PDF or Word (DOCX) format. Extracted text is used by recruiters to calculate matching scores.
        </p>
      </div>

      {/* Active Resume Card */}
      {resume ? (
        <div className="p-6 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
                <FileTextIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                    {fileName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                    <CheckCircle2Icon className="w-3 h-3" /> Active
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleView}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 px-3 py-1.5 rounded-lg transition"
              >
                <EyeIcon className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/40 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <TrashIcon className="w-3.5 h-3.5" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>

          {resume.extractedText && (
            <div className="pt-3 border-t border-zinc-800/60">
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                Parsed Content Preview
              </p>
              <p className="text-xs text-zinc-400 bg-zinc-950 p-3 rounded-lg border border-zinc-800/60 line-clamp-3 leading-relaxed font-mono">
                {resume.extractedText}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800/80 rounded-xl">
          <AlertCircleIcon className="w-10 h-10 text-zinc-700 mx-auto mb-2.5" />
          <h3 className="text-sm font-semibold text-zinc-200">No active resume on file</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            You must upload a resume before you can apply to any job openings on the platform.
          </p>
        </div>
      )}

      {/* Upload New / Replace Form */}
      <div className="p-6 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {resume ? "Replace Current Resume" : "Upload Resume Document"}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Supported formats: PDF (.pdf), Word (.docx, .doc) — max 5MB
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-400 hover:border-zinc-700 flex items-center justify-between transition">
              <span className="truncate">{file ? file.name : "Choose a file..."}</span>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Browse
              </span>
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-5 py-2.5 rounded-lg text-xs font-semibold transition shadow-sm disabled:opacity-40"
          >
            {uploading ? (
              <>
                <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadIcon className="w-3.5 h-3.5" />
                <span>{resume ? "Update Resume" : "Upload Resume"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
