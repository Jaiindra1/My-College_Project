import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";

export default function PlacementsDashboard() {
  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
          🏢 Placements Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          Manage company drives, student registrations, placement fees and more
          — all in one place.
        </p>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Company Drives */}
          <Link
            to="/placements/companies"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                🏢 Company Drives
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              View all companies visiting the campus for placements.
            </p>
            <span className="inline-block mt-4 text-blue-600 group-hover:underline dark:text-blue-400">
              View Companies →
            </span>
          </Link>

          {/* Add Company */}
          <Link
            to="/admin/placements/add-company"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              ➕ Add Company
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add a new company drive with role, CTC, and drive date.
            </p>
            <span className="inline-block mt-4 text-green-600 group-hover:underline dark:text-green-400">
              Add New →
            </span>
          </Link>

          {/* Manage Fees */}
          <Link
            to="/admin/placements/manage-fees"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              💰 Manage Fees
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Record and manage placement-related fee payments.
            </p>
            <span className="inline-block mt-4 text-green-600 group-hover:underline dark:text-green-400">
              Manage Fees →
            </span>
          </Link>

          {/* Register Student */}
          <Link
            to="/admin/placements/register-student"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              📝 Register Student
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Register a student for a specific company drive.
            </p>
            <span className="inline-block mt-4 text-purple-600 group-hover:underline dark:text-purple-400">
              Register Now →
            </span>
          </Link>

          {/* Update Status */}
          <Link
            to="/admin/placements/update-status"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              🔄 Update Status
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Update student placement status — Registered, Selected, Rejected.
            </p>
            <span className="inline-block mt-4 text-orange-600 group-hover:underline dark:text-orange-400">
              Update →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
