import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

export default function FacultyList() {
  const [faculty, setFaculty] = useState([]);

  const fetchFaculty = async () => {
    try {
      const { data } = await api.get("/faculty");
      setFaculty(data);
    } catch (err) {
      console.error("❌ Error fetching faculty:", err);
      alert("Failed to fetch faculty list");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;
    try {
      await api.delete(`/faculty/${id}`);
      alert("✅ Faculty deleted successfully");
      fetchFaculty();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete faculty");
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return (
    <div className="flex min-h-screen font-display bg-[#f8fafc] dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-300">
            👩‍🏫 Faculty Management
          </h2>
          <Link
            to="/admin/faculty/add"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg 
                     bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold text-sm
                     shadow-md hover:from-teal-600 hover:to-blue-700 hover:shadow-lg 
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-400 active:scale-95"
          >
            ➕ Add Faculty
          </Link>
        </header>

        {/* Table */}
        <div className="bg-white dark:bg-background-dark/60 rounded-xl shadow-xl border border-blue-100 dark:border-blue-800">
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-sm text-left bg-white dark:bg-background-dark/60">
              {/* Table Header */}
              <thead>
                <tr style={{ textAlign: "center"}} className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs uppercase tracking-wide">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Delete</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {faculty.length > 0 ? (
                  faculty.map((f, idx) => (
                    <tr style={{ textAlign: "center"}}
                      key={f.faculty_id}
                      className={`border-b border-blue-100 dark:border-blue-800 transition-colors duration-200 ${
                        idx % 2 === 0
                          ? "bg-white " // clean white rows
                          : "bg-[#fefefe] " // slightly off-white for alt rows
                      }`}
                    >
                      <td className="px-6 py-3 font-semibold text-blue-700 dark:text-blue-300">
                        {f.faculty_id}
                      </td>
                      <td className="px-6 py-3 font-medium text-teal-700 dark:text-teal-300">
                        {f.name}
                      </td>
                      <td className="px-6 py-3 text-emerald-700 dark:text-emerald-300">
                        {f.email}
                      </td>
                      <td className="px-6 py-3 text-amber-700 dark:text-amber-300 font-medium">
                        {f.department}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                            f.status === "active"
                              ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                              : "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                          }`}
                        >
                          {f.status === "active" ? "❌" : "✅"}
                          <span className="capitalize">{f.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <Link
                          to={`/admin/faculty/edit/${f.faculty_id}`}
                          className="px-3 py-1 text-xls border-bottom-2px font-medium text-black shadow-sm"
                        >
                          Edit
                        </Link>
                        
                      </td>
                      <td><button
                          onClick={() => handleDelete(f.faculty_id)}
                          className="px-3 py-1 text-xs font-medium rounded-md bg-red-500 hover:bg-red-600 text-white shadow-sm"
                        >
                          Delete
                        </button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-6 text-center text-blue-600 dark:text-blue-300 font-medium"
                    >
                      No faculty found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
