import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { ClockIcon, CheckCircle2Icon, UserIcon } from "lucide-react";

export default function RecentActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await API.get("/recruiter/recent-activity");
        setActivity(data);
      } catch (err) {
        console.error("Failed to fetch recent activity", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          <p className="text-xs text-zinc-500">Live submission updates</p>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-zinc-500 py-6 text-center">Loading activity feed...</p>
      ) : activity.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500">
          <ClockIcon className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
          <p>No recent activity detected.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {activity.map((item, index) => {
            const isShortlisted = item.type === "shortlisted";
            return (
              <li
                key={index}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/40 text-xs text-zinc-300"
              >
                <div
                  className={`mt-0.5 p-1 rounded-md border ${
                    isShortlisted
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                      : "bg-zinc-800/80 text-zinc-300 border-zinc-700/50"
                  }`}
                >
                  {isShortlisted ? (
                    <CheckCircle2Icon className="w-3.5 h-3.5" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate">
                    <span className="font-semibold text-zinc-100">{item.candidateName}</span>{" "}
                    <span className="text-zinc-500">
                      {isShortlisted ? "was shortlisted for" : "applied for"}
                    </span>{" "}
                    <span className="text-zinc-300 font-medium">{item.jobTitle}</span>
                  </p>
                  {item.time && (
                    <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">
                      {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
