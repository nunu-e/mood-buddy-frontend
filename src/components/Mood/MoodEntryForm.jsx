import React, { useState, useEffect } from "react";
import { useMood } from "../../contexts/MoodContext";
import "./MoodEntryForm.css";

const MoodEntryForm = ({ entry = null, date = new Date(), onSuccess }) => {
  const { addMoodEntry, updateMoodEntry } = useMood();
  const [formData, setFormData] = useState({
    mood: "",
    moodIntensity: 5,
    journalEntry: "",
    tags: [],
    activities: [],
    sleepHours: "",
    weather: "",
  });

  const moods = [
    { value: "excited", label: "Excited", emoji: "😄", color: "#FF6B6B" },
    { value: "happy", label: "Happy", emoji: "😊", color: "#4ECDC4" },
    { value: "neutral", label: "Neutral", emoji: "😐", color: "#45B7D1" },
    { value: "sad", label: "Sad", emoji: "😔", color: "#96CEB4" },
    { value: "anxious", label: "Anxious", emoji: "😰", color: "#FFEAA7" },
    { value: "angry", label: "Angry", emoji: "😠", color: "#DDA0DD" },
    { value: "tired", label: "Tired", emoji: "😴", color: "#98D8C8" },
  ];

  const activitiesList = [
    "exercise",
    "work",
    "social",
    "family",
    "hobby",
    "rest",
    "learning",
    "nature",
  ];

  useEffect(() => {
    if (entry) {
      setFormData({
        mood: entry.mood || "",
        moodIntensity: entry.moodIntensity || 5,
        journalEntry: entry.journalEntry || "",
        tags: entry.tags || [],
        activities: entry.activities || [],
        sleepHours: entry.sleepHours || "",
        weather: entry.weather || "",
      });
    }
  }, [entry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mood) {
      alert("Please select a mood");
      return;
    }

    try {
      let result;
      if (entry) {
        result = await updateMoodEntry(entry._id, { ...formData, date });
      } else {
        result = await addMoodEntry({ ...formData, date });
      }

      if (result.success) {
        setFormData({
          mood: "",
          moodIntensity: 5,
          journalEntry: "",
          tags: [],
          activities: [],
          sleepHours: "",
          weather: "",
        });
        if (onSuccess) onSuccess();
      } else {
        alert(
          result.message || `Failed to ${entry ? "update" : "save"} mood entry`
        );
      }
    } catch (error) {
      console.error(error);
      alert(`Failed to ${entry ? "update" : "save"} mood entry`);
    }
  };

  const handleActivityToggle = (activity) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  return (
    <form className="mood-entry-form" onSubmit={handleSubmit}>
      <div className="mood-selection">
        <label className="form-label">How are you feeling?</label>
        <div className="mood-options">
          {moods.map((mood) => (
            <button
              key={mood.value}
              type="button"
              className={`mood-option ${
                formData.mood === mood.value ? "selected" : ""
              }`}
              style={{
                borderColor:
                  formData.mood === mood.value ? mood.color : "transparent",
              }}
              onClick={() =>
                setFormData((prev) => ({ ...prev, mood: mood.value }))
              }
            >
              <span className="emoji">{mood.emoji}</span>
              <span className="label">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rest of the form remains the same */}
      <div className="form-group">
        <label className="form-label">
          Mood Intensity:{" "}
          <span className="intensity-value">{formData.moodIntensity}/10</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.moodIntensity}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              moodIntensity: parseInt(e.target.value),
            }))
          }
          className="intensity-slider"
        />
        <div className="slider-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Journal Entry (Optional)</label>
        <textarea
          value={formData.journalEntry}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, journalEntry: e.target.value }))
          }
          placeholder="How was your day? What's on your mind?"
          rows="4"
          maxLength="2000"
          className="form-textarea"
        />
        <div className="char-count">{formData.journalEntry.length}/2000</div>
      </div>

      <div className="form-group">
        <label className="form-label">Activities Today</label>
        <div className="activities-grid">
          {activitiesList.map((activity) => (
            <label key={activity} className="activity-checkbox">
              <input
                type="checkbox"
                checked={formData.activities.includes(activity)}
                onChange={() => handleActivityToggle(activity)}
              />
              <span className="checkmark"></span>
              <span className="activity-label">
                {activity.charAt(0).toUpperCase() + activity.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Sleep Hours</label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleepHours}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, sleepHours: e.target.value }))
            }
            className="form-input"
            placeholder="e.g., 7.5"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Weather</label>
          <select
            value={formData.weather}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, weather: e.target.value }))
            }
            className="form-select"
          >
            <option value="">Select weather</option>
            <option value="sunny">☀️ Sunny</option>
            <option value="cloudy">☁️ Cloudy</option>
            <option value="rainy">🌧️ Rainy</option>
            <option value="snowy">❄️ Snowy</option>
            <option value="windy">💨 Windy</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary submit-btn"
        disabled={!formData.mood}
      >
        {entry ? "Update Entry" : "Save Mood Entry"}
      </button>
    </form>
  );
};

export default MoodEntryForm;
