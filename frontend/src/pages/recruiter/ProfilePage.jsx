import React from "react";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Recruiter Profile
        </h2>
        <div className="space-y-3">
          <p>
            <span className="font-medium text-gray-700">Name:</span>{" "}
            {user?.name}
          </p>
          <p>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            {user?.email}
          </p>
          <p>
            <span className="font-medium text-gray-700">Role:</span>{" "}
            {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
