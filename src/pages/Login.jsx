import { useState } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      if (form.role === "admin") navigate("/admin");
      else if (form.role === "faculty") navigate("/faculty");
      else navigate("/student");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
