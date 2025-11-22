import React, { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import "./MoodCalendar.css";

const MoodCalendar = ({ entries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const moodData = useMemo(() => {
    const data = {};
    (entries || []).forEach((entry) => {
      const dateKey = format(new Date(entry.date), "yyyy-MM-dd");
      data[dateKey] = {
        mood: entry.mood,
        intensity: entry.moodIntensity,
        hasJournal: !!entry.journalEntry,
      };
    });
    return data;
  }, [entries]);

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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getMoodForDate = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return moodData[dateKey];
  };

  return (
    <div className="mood-calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)} className="nav-btn">
          ‹
        </button>
        <h3>{format(currentDate, "MMMM yyyy")}</h3>
        <button onClick={() => navigateMonth(1)} className="nav-btn">
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const moodEntry = getMoodForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`calendar-day ${
                isCurrentMonth ? "current-month" : "other-month"
              } ${isToday ? "today" : ""}`}
            >
              <div className="day-number">{format(day, "d")}</div>
              {moodEntry && (
                <div
                  className="mood-indicator"
                  style={{
                    backgroundColor: moodColors[moodEntry.mood],
                    opacity: moodEntry.intensity / 10,
                  }}
                  title={`${moodEntry.mood} (${moodEntry.intensity}/10)`}
                >
                  {moodEmojis[moodEntry.mood]}
                  {moodEntry.hasJournal && (
                    <span className="journal-dot">📝</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <div className="legend-title">Mood Legend:</div>
        <div className="legend-items">
          {Object.entries(moodEmojis).map(([mood, emoji]) => (
            <div key={mood} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: moodColors[mood] }}
              ></span>
              <span className="legend-emoji">{emoji}</span>
              <span className="legend-label">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;
