import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { FileTextIcon, BriefcaseIcon, BarChartIcon } from "lucide-react";

export default function CandidateOverview() {
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resumeRes = await API.get("/resumes/me");
        setResume(resumeRes.data.resume);
      } catch {
        setResume(null);
      }

      try {
        const jobsRes = await API.get("/jobs");
        setJobs(jobsRes.data);
      } catch {
        setJobs([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Welcome to Your Dashboard 👋</h1>
      <p className="text-gray-600">Here’s a quick summary of your internship activity.</p>

      {/* Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors duration-300">

          <FileTextIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Resume Status</h2>
            <p className="text-gray-500 text-sm">
              {resume ? "Uploaded" : "Not Uploaded"}
            </p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors duration-300">

          <BriefcaseIcon className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Available Jobs</h2>
            <p className="text-gray-500 text-sm">{jobs.length} Opportunities</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors duration-300">

          <BarChartIcon className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Profile Strength</h2>
            <p className="text-gray-500 text-sm">
              {resume ? "Good (Resume uploaded)" : "Weak (Upload resume)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
