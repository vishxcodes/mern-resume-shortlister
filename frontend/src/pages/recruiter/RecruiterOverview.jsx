import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import RecentActivity from "../../components/RecentActivity";
import ActiveJobsTable from "../../components/ActiveJobsTable";
import { BriefcaseIcon, UsersIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";

export default function RecruiterOverview() {
  const [stats, setStats] = useState({
    totalActiveJobs: 0,
    totalApplicants: 0,
    shortlistedCandidates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await API.get("/recruiter/dashboard-stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch recruiter dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Recruiter Overview
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Monitor your job postings, candidate submissions, and shortlist pipeline.
        </p>
      </div>

      {/* KPI Stats Section */}
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-500 py-6">
          <Loader2Icon className="w-4 h-4 animate-spin text-zinc-400" />
          <span>Loading pipeline statistics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Active Jobs */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Active Jobs</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                <BriefcaseIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">{stats.totalActiveJobs}</span>
              <span className="text-[11px] text-zinc-500 font-mono">open positions</span>
            </div>
          </div>

          {/* Total Applicants */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Total Applicants</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                <UsersIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">{stats.totalApplicants}</span>
              <span className="text-[11px] text-zinc-500 font-mono">resumes reviewed</span>
            </div>
          </div>

          {/* Shortlisted */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Shortlisted Candidates</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">{stats.shortlistedCandidates}</span>
              <span className="text-[11px] text-emerald-400/80 font-mono">qualified matches</span>
            </div>
          </div>
        </div>
      )}

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs Table */}
        <div className="lg:col-span-2">
          <ActiveJobsTable />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
