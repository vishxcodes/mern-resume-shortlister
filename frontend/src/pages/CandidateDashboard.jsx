import Layout from "../components/Layout";
import UploadResume from "./UploadResume";
import JobsList from "./JobsList";

export default function CandidateDashboard() {
  return (
    <Layout title="Candidate Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadResume />
        <JobsList />
      </div>
    </Layout>
  );
}
