import { useState, useContext, useEffect } from "react";
import API from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function UploadResume() {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);

  // 🧠 Fetch the user's existing resume when page loads
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data } = await API.get("/resumes/me");
        if (data.resume) setUploadedResume(data.resume);
      } catch (err) {
        console.error("No resume found yet");
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

  // 🧩 View resume function
  const handleViewResume = () => {
    if (!uploadedResume) return;
    const fileUrl = `http://localhost:8000/${uploadedResume.fileUrl}`;
    window.open(fileUrl, "_blank");
  };

  return (
    <div className="p-6 rounded-xl bg-white shadow-lg border border-gray-100">
      <h2 className="text-lg font-semibold mb-3">Upload Resume</h2>

      {/* Upload form */}
      <div className="flex items-center gap-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf,.doc,.docx"
          className="border p-2 w-full"
        />
        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Upload
        </button>
      </div>

      {/* Uploaded resume info */}
      {uploadedResume ? (
        <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded">
          <h3 className="font-semibold text-green-700 mb-1">
            Your current uploaded resume:
          </h3>
          <p className="text-sm text-gray-700">
            <span className="font-medium">File:</span>{" "}
            {uploadedResume.fileUrl.split("/").pop()}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Uploaded on:</span>{" "}
            {new Date(uploadedResume.createdAt).toLocaleString()}
          </p>

          {/* View Resume Button */}
          <button
            onClick={handleViewResume}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            View Resume
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-500">
          No resume uploaded yet. Please upload one.
        </p>
      )}
    </div>
  );
}
