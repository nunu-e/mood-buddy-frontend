import React, { useState } from "react";
import { useMood } from "../contexts/MoodContext";
import MoodEntryForm from "../components/Mood/MoodEntryForm";
import MoodEntryCard from "../components/Mood/MoodEntryCard";
import "./Journal.css";

const Journal = () => {
  const { moodEntries, loading, deleteMoodEntry } = useMood();
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setShowMoodForm(true);
  };

  const handleDelete = async (entryId) => {
    if (window.confirm("Are you sure you want to delete this mood entry?")) {
      const result = await deleteMoodEntry(entryId);
      if (result.success) {
        // Entry will be removed from context
      } else {
        alert(result.message);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowMoodForm(false);
    setSelectedEntry(null);
  };

  const filteredEntries = moodEntries.filter((entry) => {
    if (filter === "all") return true;
    return entry.mood === filter;
  });

  return (
    <div className="journal">
      <div className="journal-header">
        <div className="header-content">
          <h1>Your Journal 📝</h1>
          <p>Reflect on your daily moods and thoughts</p>
        </div>
        <button
          onClick={() => setShowMoodForm(true)}
          className="btn btn-primary"
        >
          + New Entry
        </button>
      </div>

      {/* Filters */}
      <div className="journal-filters">
        <div className="filter-group">
          <label>Filter by mood:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Moods</option>
            <option value="excited">😄 Excited</option>
            <option value="happy">😊 Happy</option>
            <option value="neutral">😐 Neutral</option>
            <option value="sad">😔 Sad</option>
            <option value="anxious">😰 Anxious</option>
            <option value="angry">😠 Angry</option>
            <option value="tired">😴 Tired</option>
          </select>
        </div>
      </div>

      {/* Mood Entries List */}
      <div className="journal-entries">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your entries...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No journal entries yet</h3>
            <p>Start by creating your first mood entry!</p>
            <button
              onClick={() => setShowMoodForm(true)}
              className="btn btn-primary"
            >
              Create First Entry
            </button>
          </div>
        ) : (
          <div className="entries-grid">
            {filteredEntries.map((entry) => (
              <MoodEntryCard
                key={entry._id}
                entry={entry}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mood Form Modal */}
      {showMoodForm && (
        <div className="mood-form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedEntry ? "Edit Entry" : "New Mood Entry"}</h3>
              <button
                onClick={() => {
                  setShowMoodForm(false);
                  setSelectedEntry(null);
                }}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <MoodEntryForm
              entry={selectedEntry}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
