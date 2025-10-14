import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({ email: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile");
        setProfile(data);
        setForm({ email: data.email || "", phone: data.phone || "" });
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await api.put("/profile", form);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      const serverMsg = err.response?.data?.error || "An unexpected error occurred.";
      alert(`Error updating profile: ${serverMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      return alert("Passwords do not match");
    }
    setIsSubmitting(true);
    try {
      await api.put("/profile/change-password", passwordForm);
      alert("✅ Password updated successfully!");
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.error("❌ Error changing password:", err);
      const serverMsg = err.response?.data?.error || "An unexpected error occurred.";
      alert(`Error changing password: ${serverMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark">
      <div className="flex flex-col min-h-screen">
        <header className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-3xl">school</span>
                  <h1 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Academics Hub</h1>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student">Dashboard</a>
                <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/attendance">Attendance</a>
                <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/placements">Placements</a>
                <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/exams">Exams & Results</a>
                <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/analytics">Analytics</a>
                <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/helpdesk">HelpDesk</a>
                <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/fee">Fee</a>
                <a className="text-sm font-bold text-primary transition-colors" href="/student/profile">Settings</a>
              </nav>
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 rounded-full text-muted-light dark:text-muted-dark hover:bg-primary/10">
                  <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBU79XhrTQTvU5yfPM73BTeFHCNfEOma2YeyQVdQV-EcZ-bSZb5Ep_MG5lKwoDBiz_TK9aeZEp-BWPwSP83NzAmt5E1JtwY-FUqu9kR38Qk3LRCILi3bIQN4_HFwhS17RfU-NWHMCeUYeCVAFn28SKlbHBtOMIy0IgXn8rjItFF-FMI76baM-Nyrw0G0KzZrXSXR0Cl1_MCA6Yz4FAkFoMUNi4Ylsn9PcQD5Y59e03fk-VcOmdIH96zCy5m_23wT7gRmpvk-fIBY-0")` }}></div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground-light dark:text-foreground-dark">Profile &amp; Settings</h2>
              <p className="text-muted-light dark:text-muted-dark mt-1">Manage your personal information, profile picture, and password.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.picture || "https://lh3.googleusercontent.com/a/default-user"})` }}></div>
                      <label className="cursor-pointer absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-primary/80 transition-colors" for="picture-upload">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </label>
                      <input className="hidden" id="picture-upload" type="file" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground-light dark:text-foreground-dark">{profile.name || "Student Name"}</h3>
                    <p className="text-sm text-muted-light dark:text-muted-dark">Roll No: {profile.roll_no || "N/A"}</p>
                    <p className="text-sm text-primary">{profile.role || "Student"}</p>
                  </div>
                </div>
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-foreground-light dark:text-foreground-dark">Profile Picture</h3>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-8 text-center">
                    <span className="material-symbols-outlined text-5xl text-muted-light dark:text-muted-dark">cloud_upload</span>
                    <p className="mt-2 text-sm text-muted-light dark:text-muted-dark">Drag &amp; drop or click to upload</p>
                    <button className="mt-4 flex items-center gap-2 bg-primary/20 dark:bg-primary/30 text-primary font-semibold text-sm py-2 px-4 rounded-lg hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors">Browse Files</button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">Personal Details</h3>
                    <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"><span className="material-symbols-outlined text-base">edit</span>Edit</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-light dark:text-muted-dark"for="name">Name</label>
                      <input id="name" disabled className="mt-1 form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark disabled:opacity-70" value={profile.name || ""} />
                    </div>
                    <div >
                      <label className="text-sm font-medium text-muted-light dark:text-muted-dark" for="roll_no">Roll No</label>
                      <input id="roll_no" disabled className="mt-1 form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark disabled:opacity-70" value={profile.roll_no || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-light dark:text-muted-dark" for="email">Email</label>
                      <input id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 form-input rounded-lg border-border-light dark:border-border-dark focus:border-primary focus:ring-primary" type="email" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-light dark:text-muted-dark" for="phone">Phone</label>
                      <input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 form-input rounded-lg border-border-light dark:border-border-dark focus:border-primary focus:ring-primary" type="tel" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-sm font-medium text-muted-light dark:text-muted-dark" for="department">Department</label>
                      <input id="department" disabled className="mt-1 w-full form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark disabled:opacity-50" value={profile.department || "INFORMATION TECHNOLOGY"} />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button onClick={handleUpdate} disabled={isSubmitting} className="bg-primary text-white font-bold text-sm py-2 px-6 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                  </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-foreground-light dark:text-foreground-dark">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-light dark:text-muted-dark" for="current_password">Current Password</label>
                      <input id="current_password" type="password" value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                       className="mt-1 form-input w-full rounded-lg border-border-light dark:border-border-dark focus:border-primary focus:ring-primary" placeholder="Enter current password" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-light dark:text-muted-dark" for="new_password">New Password</label>
                      <input id="new_password" type="password" value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                       className="mt-1 form-input w-full rounded-lg border-border-light dark:border-border-dark focus:border-primary focus:ring-primary" placeholder="Enter new password" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-light dark:text-muted-dark" for="confirm_password">Confirm New Password</label>
                      <input id="confirm_password" type="password" value={passwordForm.confirm_password} onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                       className="mt-1 form-input w-full rounded-lg border-border-light dark:border-border-dark focus:border-primary focus:ring-primary" placeholder="Confirm new password" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button onClick={handlePasswordChange} disabled={isSubmitting} className="bg-primary text-white font-bold text-sm py-2 px-6 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Updating...' : 'Update Password'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
