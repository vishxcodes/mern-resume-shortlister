import React from "react";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import PostJob from "./PostJob";
import RankedResumes from "./RankedResumes";

const RecruiterDashboard = () => {
  return (
    <RecruiterLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Recruiter Dashboard</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-10">
          <PostJob />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <RankedResumes />
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
