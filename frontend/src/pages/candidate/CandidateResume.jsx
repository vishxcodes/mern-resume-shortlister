import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FileTextIcon, UploadIcon, EyeIcon, TrashIcon } from "lucide-react";

export default function CandidateResume() {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);

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
    if (!file) return toast.error("Please select a file");
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const { data } = await API.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResume(data.resume);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      toast.error("Error uploading resume");
    }
  };

  const handleView = () => {
    if (resume) window.open(`http://localhost:8000/${resume.fileUrl}`, "_blank");
  };

  const handleDelete = async () => {
    try {
      await API.delete("/resumes/me");
      setResume(null);
      toast.info("Resume deleted");
    } catch {
      toast.error("Error deleting resume");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">My Resume</h1>
      <div className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-4 transition-colors duration-300">

        {resume ? (
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileTextIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {resume.fileUrl.split("/").pop()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Uploaded on {new Date(resume.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleView}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors duration-200"
                >
                  <EyeIcon className="w-4 h-4" /> View
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No resume uploaded yet.</p>
        )}

        <div className="flex flex-col md:flex-row items-center gap-3 mt-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.doc,.docx"
            className="border p-2 rounded w-full md:w-auto"
          />
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <UploadIcon className="w-4 h-4" /> Upload
          </button>
        </div>
      </div>
    </div>
  );
}
