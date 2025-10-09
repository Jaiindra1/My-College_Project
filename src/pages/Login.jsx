import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      
      // save token in AuthContext
      login(data); 

      // redirect by role
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "faculty") navigate("/faculty");
      else if (data.user.role === "student") navigate("/student");

    } catch (err) {
      setError(err.response?.data?.error || "❌ Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg w-96 p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">🔑 Login</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
        >
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
