import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading activity...</p>
      ) : activity.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity</p>
      ) : (
        <ul className="space-y-3">
          {activity.map((item, index) => (
            <li
              key={index}
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              {item.type === "applied" ? "🧑‍🎓" : "⭐"}{" "}
              <span className="font-medium">{item.candidateName}</span>{" "}
              {item.type === "applied" ? "applied to" : "was shortlisted for"}{" "}
              <span className="font-medium">{item.jobTitle}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
