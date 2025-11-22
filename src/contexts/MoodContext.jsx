import React, { createContext, useState, useContext, useEffect } from "react";
import { moodAPI } from "../utils/api";
import { useAuth } from "./AuthContext";

const MoodContext = createContext();

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
};

export const MoodProvider = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
      fetchStats();
    }
  }, [user]);

  const fetchMoodEntries = async (params = {}) => {
    setLoading(true);
    try {
      const response = await moodAPI.getEntries(params);
      if (response.data.success) {
        setMoodEntries(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch mood entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (days = 30) => {
    try {
      const response = await moodAPI.getStats(days);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const addMoodEntry = async (entryData) => {
    try {
      const formattedData = {
        ...entryData,
        date:
          entryData.date instanceof Date
            ? entryData.date.toISOString()
            : entryData.date,
      };

      const response = await moodAPI.createEntry(formattedData);
      if (response.data.success) {
        setMoodEntries((prev) => [response.data.data, ...prev]);
        await fetchStats();
        return {
          success: true,
          data: response.data.data,
          streak: response.data.streak,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to save mood entry",
      };
    }
  };

  const updateMoodEntry = async (id, entryData) => {
    try {
      const response = await moodAPI.updateEntry(id, entryData);
      if (response.data.success) {
        setMoodEntries((prev) =>
          prev.map((entry) => (entry._id === id ? response.data.data : entry))
        );
        await fetchStats();
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update mood entry",
      };
    }
  };

  const deleteMoodEntry = async (id) => {
    try {
      const response = await moodAPI.deleteEntry(id);
      if (response.data.success) {
        setMoodEntries((prev) => prev.filter((entry) => entry._id !== id));
        await fetchStats();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete mood entry",
      };
    }
  };

  const getTodayEntry = () => {
    const today = new Date().toDateString();
    return moodEntries.find(
      (entry) => new Date(entry.date).toDateString() === today
    );
  };

  const getEntryById = (id) => {
    return moodEntries.find((entry) => entry._id === id);
  };

  const value = {
    moodEntries,
    stats,
    loading,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    getTodayEntry,
    getEntryById,
    refreshEntries: fetchMoodEntries,
    refreshStats: fetchStats,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};
