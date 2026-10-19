import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FileTextIcon, EyeIcon, UploadIcon } from "lucide-react";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data } = await API.get("/resumes/me");
        setUploadedResume(data.resume);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResume();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file to upload");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const { data } = await API.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedResume(data.resume);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error uploading resume");
    }
  };

  const handleViewResume = () => {
    if (!uploadedResume) return;
    const targetUrl = uploadedResume.resumeUrl || uploadedResume.fileUrl;
    if (!targetUrl) return;
    const finalHref = targetUrl.startsWith("http")
      ? targetUrl
      : `http://localhost:8000/${targetUrl}`;
    window.open(finalHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-100 max-w-xl mx-auto space-y-4">
      <h2 className="text-base font-semibold text-white">Upload Resume</h2>

      <div className="flex items-center gap-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf,.doc,.docx"
          className="border border-zinc-800 bg-zinc-950 p-2 rounded-lg text-xs text-zinc-300 w-full"
        />
        <button
          onClick={handleUpload}
          className="bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shadow-sm"
        >
          <UploadIcon className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {uploadedResume && (
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <FileTextIcon className="w-4 h-4 text-zinc-400" />
            <span>Active Resume on File</span>
          </div>
          <button
            onClick={handleViewResume}
            className="text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
          >
            <EyeIcon className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      )}
    </div>
  );
}
