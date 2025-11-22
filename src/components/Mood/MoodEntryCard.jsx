import React from "react";
import { format } from "date-fns";
import "./MoodEntryCard.css";

const MoodEntryCard = ({ entry, onEdit, onDelete }) => {
  const moodEmojis = {
    excited: "😄",
    happy: "😊",
    neutral: "😐",
    sad: "😔",
    anxious: "😰",
    angry: "😠",
    tired: "😴",
  };

  const moodColors = {
    excited: "#FF6B6B",
    happy: "#4ECDC4",
    neutral: "#45B7D1",
    sad: "#96CEB4",
    anxious: "#FFEAA7",
    angry: "#DDA0DD",
    tired: "#98D8C8",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  return (
    <div className="mood-entry-card">
      <div
        className="mood-header"
        style={{ borderLeftColor: moodColors[entry.mood] }}
      >
        <div className="mood-basic-info">
          <div className="mood-emoji-date">
            <span className="mood-emoji">{moodEmojis[entry.mood]}</span>
            <div className="date-info">
              <div className="entry-date">{formatDate(entry.date)}</div>
              <div className="entry-time">{formatTime(entry.createdAt)}</div>
            </div>
          </div>
          <div className="mood-details">
            <span className="mood-name">{entry.mood}</span>
            <span className="mood-intensity">
              Intensity: {entry.moodIntensity}/10
            </span>
          </div>
        </div>

        <div className="entry-actions">
          <button
            onClick={() => onEdit(entry)}
            className="btn-action edit-btn"
            title="Edit entry"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(entry._id)}
            className="btn-action delete-btn"
            title="Delete entry"
          >
            🗑️
          </button>
        </div>
      </div>

      {entry.journalEntry && (
        <div className="journal-section">
          <h4>Journal Entry</h4>
          <p className="journal-text">{entry.journalEntry}</p>
        </div>
      )}

      {(entry.activities.length > 0 || entry.weather || entry.sleepHours) && (
        <div className="additional-info">
          {entry.activities.length > 0 && (
            <div className="info-section">
              <span className="info-label">Activities:</span>
              <div className="activities-list">
                {entry.activities.map((activity) => (
                  <span key={activity} className="activity-tag">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {entry.weather && (
            <div className="info-section">
              <span className="info-label">Weather:</span>
              <span className="weather-info">{entry.weather}</span>
            </div>
          )}

          {entry.sleepHours && (
            <div className="info-section">
              <span className="info-label">Sleep:</span>
              <span className="sleep-info">{entry.sleepHours} hours</span>
            </div>
          )}
        </div>
      )}

      {entry.tags && entry.tags.length > 0 && (
        <div className="tags-section">
          {entry.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodEntryCard;
