import PostJob from "./PostJob";
import RankedResumes from "./RankedResumes";

export default function RecruiterDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recruiter Dashboard</h1>
      <PostJob />
      <RankedResumes />
    </div>
  );
}
