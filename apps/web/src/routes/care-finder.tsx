import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/care-finder")({
  component: CareFinderPage,
});

function CareFinderPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-3 font-bold text-4xl text-gray-900">
          Find support resources in seconds
        </h1>
        <p className="mb-6 text-gray-600">
          Access care planning tools, therapy resources, and support workflows
          instantly.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/demo"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Try Demo
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
