import React from "react";
import { format } from "date-fns";
import "./RecentEntries.css";

const RecentEntries = ({ entries }) => {
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
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return format(date, "MMM dd");
    }
  };

  if (entries.length === 0) {
    return (
      <div className="recent-entries-empty">
        <div className="empty-icon">📝</div>
        <p>No recent entries</p>
      </div>
    );
  }

  return (
    <div className="recent-entries">
      {entries.map((entry) => (
        <div
          key={entry._id}
          className="recent-entry-item"
          style={{ borderLeftColor: moodColors[entry.mood] }}
        >
          <div className="entry-emoji">{moodEmojis[entry.mood]}</div>
          <div className="entry-details">
            <div className="entry-mood">{entry.mood}</div>
            <div className="entry-date">{formatDate(entry.date)}</div>
          </div>
          <div className="entry-intensity">{entry.moodIntensity}/10</div>
          {entry.journalEntry && (
            <div className="journal-indicator" title="Has journal entry">
              📝
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentEntries;
