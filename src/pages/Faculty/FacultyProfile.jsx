import React, { useEffect, useState } from "react";
import Sidebar from "../../components/FacultySidebar"; // ✅ Sidebar added
import api from "../../api/axiosInstance";

export default function FacultyProfile() {
  const facultyId = JSON.parse(localStorage.getItem("user")).user_id; // Logged-in faculty ID
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    faculty_id: "",
    profile_image: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/faculty/${facultyId}/profile`);
        setProfile(data);
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, [facultyId]);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.id]: e.target.value });
  };

  // Save profile
  const handleSave = async () => {
    try {
      await api.put(`/faculty/${facultyId}/profile`, profile);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert("❌ Failed to update profile");
    }
  };

  // Change password
  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }
    try {
      await api.put(`/faculty/${facultyId}/change-password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      alert("✅ Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert("❌ Failed to change password");
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* ✅ Sidebar added here */}
      <Sidebar />

      {/* ✅ Main Content (your original form untouched) */}
      <main className="flex-1 overflow-y-auto text-slate-800 dark:text-slate-200">
        <header className="bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 mb-18">
          <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Academics Portal
            </h1>
            <div className="flex items-center gap-4">
              <button className="text-slate-500 dark:text-slate-300 hover:text-primary">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div
                className="size-10 rounded-full bg-cover bg-center border-2 border-slate-300 dark:border-slate-700"
                style={{
                  backgroundImage: `url(${profile.profile_image ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBoVvmsRk4isXi0baBgYFHEmkA88DL--gFM5aRfqjszuW8Qzub9d6w31HhZegKIu_VdMYi3mwlfyfoj6D7gJyn2XMgmq4nTErWX6Q5bfQKm51gsucxHl5t3UwUJztQppyVtmSoQ7i7kzzTP6zFK_sP-4xjAOLSH9C7etfWsvop3-ZmgfWcow7OOFm2KhXu8ez84v6c72hnFL0mD5Rl4svZp79A7x_xKHLLU_kd5ooba8CjPCj5lm6Mwq5HZU_hHyice7nwmNLYONpo"})`,
                }}
              ></div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Faculty Profile
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Manage your personal information and account settings.
          </p>

          {successMessage && (
            <div className="flex items-center gap-3 bg-green-100 text-green-700 p-4 rounded-lg mb-6">
              <span className="material-symbols-outlined">check_circle</span>
              {successMessage}
            </div>
          )}

          {/* Personal Info Card */}
          <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-10">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold">Personal Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative">
                  <div
                    className="size-24 rounded-full border-4 border-white dark:border-slate-900 shadow bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${profile.profile_image ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBoVvmsRk4isXi0baBgYFHEmkA88DL--gFM5aRfqjszuW8Qzub9d6w31HhZegKIu_VdMYi3mwlfyfoj6D7gJyn2XMgmq4nTErWX6Q5bfQKm51gsucxHl5t3UwUJztQppyVtmSoQ7i7kzzTP6zFK_sP-4xjAOLSH9C7etfWsvop3-ZmgfWcow7OOFm2KhXu8ez84v6c72hnFL0mD5Rl4svZp79A7x_xKHLLU_kd5ooba8CjPCj5lm6Mwq5HZU_hHyice7nwmNLYONpo"})`,
                    }}
                  ></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      id="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="form-input mt-1 w-full rounded-lg border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Faculty ID</label>
                    <input
                      id="faculty_id"
                      disabled
                      value={profile.faculty_id}
                      className="form-input mt-1 w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      id="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="form-input mt-1 w-full rounded-lg border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <input
                      id="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="form-input mt-1 w-full rounded-lg border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Department</label>
                    <input
                      id="department"
                      value={profile.department}
                      onChange={handleChange}
                      className="form-input mt-1 w-full rounded-lg border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/70 px-6 py-4 flex justify-end rounded-b-xl">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Password Change Card */}
          <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold">Change Password</h3>
            </div>
            <div className="p-6 space-y-4">
              {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    id={field}
                    type="password"
                    value={passwords[field]}
                    onChange={handlePasswordChange}
                    placeholder={`Enter ${field
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                    className="form-input mt-1 w-full rounded-lg border-slate-300 dark:border-slate-700"
                  />
                </div>
              ))}
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/70 px-6 py-4 flex justify-end rounded-b-xl">
              <button
                onClick={handlePasswordUpdate}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                Update Password
              </button>
            </div>
          </div>
        </main>
      </main>
    </div>
  );
}
