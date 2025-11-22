import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    dateOfBirth: user?.profile?.dateOfBirth
      ? new Date(user.profile.dateOfBirth).toISOString().split("T")[0]
      : "",
    gender: user?.profile?.gender || "prefer-not-to-say",
  });

  const [settingsForm, setSettingsForm] = useState({
    dailyReminder: user?.settings?.dailyReminder || true,
    reminderTime: user?.settings?.reminderTime || "20:00",
    theme: user?.settings?.theme || "auto",
    weekStartsOn: user?.settings?.weekStartsOn || "sunday",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile({
      profile: profileForm,
      settings: settingsForm,
    });

    if (result.success) {
      alert("Profile updated successfully!");
    } else {
      alert(result.message);
    }

    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    if (result.success) {
      alert("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      alert(result.message);
    }

    setLoading(false);
  };

  const handleExportData = () => {
    alert("Export feature coming soon!");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deletion feature coming soon!");
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile & Settings ⚙️</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="profile-layout">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <button
            className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "settings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "security" ? "active" : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            🔒 Security
          </button>
          <button
            className={`sidebar-btn ${activeTab === "data" ? "active" : ""}`}
            onClick={() => setActiveTab("data")}
          >
            📊 Data
          </button>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {activeTab === "profile" && (
            <div className="profile-section">
              <h2>Personal Information</h2>
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="form-input"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="form-input"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          dateOfBirth: e.target.value,
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="form-select"
                    >
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="profile-section">
              <h2>App Settings</h2>
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settingsForm.dailyReminder}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          dailyReminder: e.target.checked,
                        }))
                      }
                      className="checkbox-input"
                    />
                    <span className="checkmark"></span>
                    Enable daily mood reminder
                  </label>
                </div>

                {settingsForm.dailyReminder && (
                  <div className="form-group">
                    <label className="form-label">Reminder Time</label>
                    <input
                      type="time"
                      value={settingsForm.reminderTime}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          reminderTime: e.target.value,
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Week Starts On</label>
                  <select
                    value={settingsForm.weekStartsOn}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        weekStartsOn: e.target.value,
                      }))
                    }
                    className="form-select"
                  >
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  id="theme-toggle"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save Settings"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="profile-section">
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordChange} className="profile-form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="form-input"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="form-input"
                    placeholder="Enter new password"
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="form-input"
                    placeholder="Confirm new password"
                    required
                    minLength="6"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>

              <div className="security-actions">
                <button onClick={logout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="profile-section">
              <h2>Data Management</h2>

              <div className="data-section">
                <h3>Export Data</h3>
                <p>
                  Download all your mood entries and journal data in a portable
                  format.
                </p>
                <button onClick={handleExportData} className="btn btn-primary">
                  Export My Data
                </button>
              </div>

              <div className="data-section danger-zone">
                <h3>Danger Zone</h3>
                <p>
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="btn btn-danger"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
