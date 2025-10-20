export default function Layout({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {title && (
          <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
            {title}
          </h1>
        )}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
