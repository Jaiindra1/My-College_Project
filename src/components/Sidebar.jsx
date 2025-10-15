import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext


export default function Sidebar({ isOpen = true, onClose = () => {} }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth() || {}; // Get user and logout from context

  const handleLogout = () => {
    try {
      // 1️⃣ The logout function from AuthContext handles clearing storage.
      if (logout) {
        logout();
      } else {
        // Fallback if context is not available
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }

      // 2️⃣ Close sidebar if on mobile
      if (onClose) onClose();

      // 3️⃣ Redirect to home/login page
      navigate("/");
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  const navLinks = [
    { label: "Dashboard", path: "/admin", icon: "dashboard" },
    { label: "Students", path: "/admin/students", icon: "groups" },
    { label: "Exams", path: "/admin/exams", icon: "history_edu" },
    { label: "Fees", path: "/admin/fees", icon: "receipt_long" },
    { label: "Faculty", path: "/admin/faculty", icon: "school" },
    { label: "Placements", path: "/admin/placements", icon: "work" },
    { label: "Reports", path: "/admin/reports", icon: "analytics" },
    {
      label: "Notifications",
      path: "/admin/notifications",
      icon: "notifications",
    },
    { label: "Timetable", path: "/admin/timetable", icon: "calendar_month" },
  ];

   return (
     <aside
       className={`fixed md:relative z-50 inset-y-0 left-0 w-64 bg-background-light dark:bg-background-dark border-r border-primary/20 dark:border-primary/30 transform ${
         isOpen ? "translate-x-0" : "-translate-x-full"
       } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
     >
       {/* Sidebar Header */}
       <div className="flex items-center justify-between p-4 border-b border-primary/20 dark:border-primary/30">
         <div className="flex items-center gap-3">
           <img
             alt="Faculty Profile"
             className="w-10 h-10 rounded-full object-cover"
             src={user?.profilePicture || "https://via.placeholder.com/150"}
           />
           <div>
             <h1 className="text-base font-semibold text-black dark:text-white">
               {user?.name || "Admin"}
             </h1>
             <p className="text-xs text-black/60 dark:text-white/60">Admin</p>
           </div>
         </div>
 
         {/* Close button for mobile */}
         <button
           onClick={onClose}
           className="md:hidden text-black dark:text-white hover:text-primary transition"
           aria-label="Close Sidebar"
         >
           <span className="material-symbols-outlined text-2xl">close</span>
         </button>
       </div>
 
       {/* Sidebar Navigation */}
       <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
         {navLinks.map((link) => (
           <NavLink
             key={link.label}
             to={link.path}
             className={({ isActive }) =>
               `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                 isActive
                   ? "bg-primary/20 dark:bg-primary/30 text-primary"
                   : "text-black/70 dark:text-white/70 hover:bg-primary/10 dark:hover:bg-primary/20"
               }`
             }
           >
             <span className="material-symbols-outlined text-lg">
               {link.icon}
             </span>
             {link.label}
           </NavLink>
         ))}
       </nav>
 
       {/* Sidebar Footer */}
       <div className="p-4 border-t border-primary/20 dark:border-primary/30">
         <button
           onClick={handleLogout}
           className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-black dark:text-white rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
         >
           <span className="material-symbols-outlined text-lg">logout</span>
           Logout
         </button>
       </div>
     </aside>
   );
 }
 