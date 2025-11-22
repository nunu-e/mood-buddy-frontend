import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMood } from "../contexts/MoodContext";
import MoodEntryForm from "../components/Mood/MoodEntryForm";
import MoodCalendar from "../components/Mood/MoodCalendar";
import RecentEntries from "../components/Mood/RecentEntries";
import StatsCards from "../components/Dashboard/StatsCards";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const { getTodayEntry, moodEntries, stats, refreshStats } = useMood();
  const [showMoodForm, setShowMoodForm] = useState(false);

  const todayEntry = getTodayEntry();

  useEffect(() => {
    refreshStats();
  }, [moodEntries, refreshStats]);

  const handleMoodEntrySuccess = () => {
    setShowMoodForm(false);
    refreshStats();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}! 👋</h1>
        <p>Here's your mental wellness overview</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} todayEntry={todayEntry} />

      <div className="dashboard-grid">
        {/* Today's Mood Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Today's Mood</h2>
            <span className="section-date">
              {new Date().toLocaleDateString()}
            </span>
          </div>

          {todayEntry ? (
            <div className="today-mood-card">
              <div className="mood-display">
                <span className="mood-emoji-large">
                  {getMoodEmoji(todayEntry.mood)}
                </span>
                <div className="mood-details">
                  <h3 className="mood-name">{todayEntry.mood}</h3>
                  <p className="mood-intensity">
                    Intensity: {todayEntry.moodIntensity}/10
                  </p>
                  {todayEntry.journalEntry && (
                    <p className="journal-preview">
                      {todayEntry.journalEntry.substring(0, 100)}...
                    </p>
                  )}
                </div>
              </div>
              <div className="mood-actions">
                <Link to="/journal" className="btn btn-secondary">
                  View Details
                </Link>
                <button
                  onClick={() => setShowMoodForm(true)}
                  className="btn btn-primary"
                >
                  Update Entry
                </button>
              </div>
            </div>
          ) : (
            <div className="mood-entry-prompt">
              <div className="prompt-content">
                <h3>How are you feeling today?</h3>
                <p>
                  Take a moment to check in with yourself and log your mood.
                </p>
                <button
                  onClick={() => setShowMoodForm(true)}
                  className="btn btn-primary"
                >
                  Log Your Mood
                </button>
              </div>
            </div>
          )}

          {showMoodForm && (
            <div className="mood-form-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Log Your Mood</h3>
                  <button
                    onClick={() => setShowMoodForm(false)}
                    className="close-btn"
                  >
                    ×
                  </button>
                </div>
                <MoodEntryForm onSuccess={handleMoodEntrySuccess} />
              </div>
            </div>
          )}
        </div>

        {/* Recent Entries */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Entries</h2>
            <Link to="/journal" className="btn-link">
              View All
            </Link>
          </div>
          <RecentEntries entries={moodEntries.slice(0, 5)} />
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/journal" className="quick-action-card">
              <span className="action-emoji">📝</span>
              <span className="action-text">Write Journal</span>
            </Link>
            <Link to="/analytics" className="quick-action-card">
              <span className="action-emoji">📈</span>
              <span className="action-text">View Analytics</span>
            </Link>
            <Link to="/profile" className="quick-action-card">
              <span className="action-emoji">⚙️</span>
              <span className="action-text">Settings</span>
            </Link>
          </div>
        </div>

        {/* Mood Calendar */}
        <div className="dashboard-section full-width">
          <div className="section-header">
            <h2>Mood Calendar</h2>
            <p>Visualize your mood patterns over time</p>
          </div>
          <MoodCalendar entries={moodEntries} />
        </div>
      </div>
    </div>
  );
};

function getMoodEmoji(mood) {
  const moodEmojis = {
    excited: "😄",
    happy: "😊",
    neutral: "😐",
    sad: "😔",
    anxious: "😰",
    angry: "😠",
    tired: "😴",
  };
  return moodEmojis[mood] || "😐";
}

export default Dashboard;
