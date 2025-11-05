import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { username });
      setMessage(
        "If an account with that username exists, a password reset link has been sent to the associated email."
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg w-96 p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">
          Reset Password
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        <p className="text-sm text-gray-600">
          Enter your username and we'll send you a link to get back into your
          account.
        </p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;