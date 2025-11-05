import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = searchParams.get("token");
  const role = searchParams.get("role");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !role) {
        setError("Invalid or expired link.");
        setLoading(false);
        return;
      }

      try {
        // The backend expects a GET request to /reset-password/:token
        await api.get(`/auth/reset-password/${token}?role=${role}`);
        setIsValidToken(true);
        setMessage("You can now reset your password.");
      } catch (err) {
        setError(
          err.response?.data?.error || "Invalid or expired password reset link."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // The backend expects a POST request to /reset-password
      await api.post("/auth/reset-password", {
        token,
        role,
        newPassword: password,
      });
      setMessage("Password has been reset successfully! You can now log in.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Verifying link...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white rounded-xl shadow-lg w-96 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          Reset Your Password
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center">{message}</p>}

        {isValidToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center">
              <input
                id="show-password"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="show-password" className="ml-2 block text-sm text-gray-900">
                Show Password
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all disabled:bg-blue-400"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;