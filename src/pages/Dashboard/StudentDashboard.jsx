import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
  const [stats, setStats] = useState({});
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get("/dashboard/admin");
      setStats(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user.uname}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-100 p-4 rounded">Students: {stats.total_students}</div>
        <div className="bg-green-100 p-4 rounded">Faculty: {stats.total_faculty}</div>
        <div className="bg-yellow-100 p-4 rounded">Pending Fees: {stats.pending_fees}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
