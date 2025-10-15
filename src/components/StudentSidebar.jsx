import React from "react";
import { Link } from "react-router-dom";

const StudentSidebar = ({ name, rollNo, onLogout }) => {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display">
      <aside className="w-64 bg-background-light dark:bg-background-dark flex flex-col p-4 border-r border-primary/20 dark:border-primary/30">
        {/* Profile */}
        <div className="flex items-center gap-3 p-2 mb-6">
          <div
            className="w-12 h-12 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoB4M_FPLW_GWpjQwqowPKOWRrcPGw4hD0cdo9JDiS1eE8l7dSWGUhZV6jNDQ89xsr7O4gVUknUz1fG_S8TGYi-4XsEcgrDO2lPKYPCS2ey7Pe1PDq7X35tnbhKbf3eqvIuT7WLfik9OzMZms_jM87D_aRjhO5kbPs3tvTfT0dURyT7xqegdjOh6fQ7f1xHEKbV_WQ7Ve8n98_29gonxj6oj-UeQ2WpkqcUtABK8Ku39pJQB6iMxkc22evXD0BgSe_BWggIq-iI5g")',
            }}
          ></div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {name || "Student"}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Roll No: {rollNo || "--"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          <Link
            to="."
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
          >
            <span className="text-sm font-medium">🏠 Dashboard</span>
          </Link>

          <Link to="attendance" className="nav-link">📊 Attendance</Link>
          <Link to="timetable" className="nav-link">📅 Timetable</Link>
          <Link to="exams" className="nav-link">📘 Exams</Link>
          <Link to="results" className="nav-link">🎯 Results</Link>
          <Link to="placements" className="nav-link">💼 Placements</Link>
          <Link to="notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="fee" className="nav-link">💰 Fee Management</Link>
          <Link to="profile" className="nav-link">👤 Profile</Link>
          <Link to="analytics" className="nav-link">📈 Analytics</Link>
          <Link to="helpdesk" className="nav-link">🆘 Help Desk</Link>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>
    </div>
  );
};

export default StudentSidebar;
