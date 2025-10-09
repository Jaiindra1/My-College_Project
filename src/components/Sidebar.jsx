// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ dark }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 1, label: "Students", path: "/students" },
    { id: 2, label: "Exams", path: "/exams" },
    { id: 3, label: "Fees", path: "/admin/fees" },
    { id: 4, label: "Faculty", path: "/admin/faculty" },
    { id: 5, label: "Placements", path: "/placements" },
    { id: 6, label: "Reports", path: "/admin/reports" },
    { id: 7, label: "Notifications", path: "/admin/NotificationsList" },
    { id: 8, label: "Timetable", path: "/admin/timetable"}
  ];

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/");               // redirect to login
  };

  return (
    <aside
      style={{
        width: 230,
        padding: 20,
        borderRight: "1px solid #e5e7eb",
        boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
        background: dark ? "#1f2937" : "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "120vh",
      }}
    >
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              padding: 8,
              borderRadius: 8,
              fontSize: 20,
              background: "#2563eb",
              color: "#fff",
            }}
          >
            🎓
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            College Admin
          </h2>
        </div>

        {/* Navigation Links */}
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.path}
            style={{
              display: "block",
              padding: "10px 15px",
              marginBottom: 8,
              borderRadius: 6,
              textDecoration: "none",
              color: dark ? "#e5e7eb" : "#4b5563",
              fontWeight: 500,
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = dark ? "#374151" : "#f0f9ff")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "transparent")
            }
          >
            {item.label}
          </a>
        ))}
      </div>
      {/* ✅ Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "auto",
          padding: "10px 15px",
          background: dark ? "#ef4444" : "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseEnter={(e) =>
          (e.target.style.background = dark ? "#dc2626" : "#b91c1c")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = dark ? "#ef4444" : "#dc2626")
        }
      >
        🚪 Logout
      </button>
    </aside>
  );
};

export default Sidebar;
