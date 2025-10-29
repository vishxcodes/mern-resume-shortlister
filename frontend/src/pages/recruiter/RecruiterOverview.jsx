export default function RecruiterOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-gray-100">Total Jobs Posted</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">5</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-gray-100">Total Applicants</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">23</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-gray-100">Shortlisted Candidates</h2>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">8</p>
        </div>
      </div>
    </div>
  );
}
