import React, { useState, useEffect } from "react";
import { useMood } from "../contexts/MoodContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Analytics.css";

const Analytics = () => {
  const { stats, refreshStats, loading } = useMood();
  const [timeRange, setTimeRange] = useState(30);
  const [activeChart, setActiveChart] = useState("moodTrend");

  useEffect(() => {
    refreshStats(timeRange);
  }, [timeRange, refreshStats]);

  const moodColors = {
    excited: "#FF6B6B",
    happy: "#4ECDC4",
    neutral: "#45B7D1",
    sad: "#96CEB4",
    anxious: "#FFEAA7",
    angry: "#DDA0DD",
    tired: "#98D8C8",
  };

  if (loading && !stats) {
    return (
      <div className="analytics">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalEntries === 0) {
    return (
      <div className="analytics">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h2>No Data Yet</h2>
          <p>Start logging your moods to see analytics and insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <div className="header-content">
          <h1>Analytics 📈</h1>
          <p>Understand your mood patterns and trends</p>
        </div>

        <div className="time-range-selector">
          <label>Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="range-select"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-item">
          <div className="stat-value">
            {stats.averageMood?.toFixed(1) || 0}/10
          </div>
          <div className="stat-label">Average Mood</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.streak?.current || 0}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.streak?.longest || 0}</div>
          <div className="stat-label">Longest Streak</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.totalEntries || 0}</div>
          <div className="stat-label">Total Entries</div>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="chart-navigation">
        <button
          className={`chart-nav-btn ${
            activeChart === "moodTrend" ? "active" : ""
          }`}
          onClick={() => setActiveChart("moodTrend")}
        >
          Mood Trend
        </button>
        <button
          className={`chart-nav-btn ${
            activeChart === "moodDistribution" ? "active" : ""
          }`}
          onClick={() => setActiveChart("moodDistribution")}
        >
          Mood Distribution
        </button>
        <button
          className={`chart-nav-btn ${
            activeChart === "activities" ? "active" : ""
          }`}
          onClick={() => setActiveChart("activities")}
        >
          Activities
        </button>
      </div>

      {/* Charts */}
      <div className="charts-container">
        {activeChart === "moodTrend" &&
          stats.moodTrend &&
          stats.moodTrend.length > 0 && (
            <div className="chart-card">
              <h3>Mood Trend Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.moodTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#667eea"
                    strokeWidth={2}
                    dot={{ fill: "#667eea", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#764ba2" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

        {activeChart === "moodDistribution" &&
          stats.moodDistribution &&
          stats.moodDistribution.length > 0 && (
            <div className="chart-card">
              <h3>Mood Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.moodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ mood, percent }) =>
                      `${mood} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.moodDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={moodColors[entry.mood] || "#ccc"}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

        {activeChart === "activities" &&
          stats.activityFrequency &&
          stats.activityFrequency.length > 0 && (
            <div className="chart-card">
              <h3>Activity Frequency</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.activityFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activity" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        {/* Show message if no chart data */}
        {((activeChart === "moodTrend" &&
          (!stats.moodTrend || stats.moodTrend.length === 0)) ||
          (activeChart === "moodDistribution" &&
            (!stats.moodDistribution || stats.moodDistribution.length === 0)) ||
          (activeChart === "activities" &&
            (!stats.activityFrequency ||
              stats.activityFrequency.length === 0))) && (
          <div className="chart-card">
            <div className="no-chart-data">
              <p>
                No data available for this chart in the selected time range.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Insights */}
      <div className="insights-grid">
        <div className="insight-card">
          <h4>Most Common Mood</h4>
          <div className="insight-value">
            {stats.moodDistribution?.[0]?.mood
              ? stats.moodDistribution[0].mood.charAt(0).toUpperCase() +
                stats.moodDistribution[0].mood.slice(1)
              : "N/A"}
          </div>
        </div>

        <div className="insight-card">
          <h4>Best Mood Day</h4>
          <div className="insight-value">
            {stats.moodTrend && stats.moodTrend.length > 0
              ? stats.moodTrend.reduce((best, current) =>
                  current.mood > best.mood ? current : best
                ).date
              : "N/A"}
          </div>
        </div>

        <div className="insight-card">
          <h4>Most Common Activity</h4>
          <div className="insight-value">
            {stats.activityFrequency?.[0]?.activity
              ? stats.activityFrequency[0].activity.charAt(0).toUpperCase() +
                stats.activityFrequency[0].activity.slice(1)
              : "N/A"}
          </div>
        </div>

        <div className="insight-card">
          <h4>Consistency</h4>
          <div className="insight-value">
            {stats.totalEntries >= 7
              ? `${Math.min(
                  100,
                  Math.round((stats.streak?.current / 7) * 100)
                )}%`
              : "Keep logging!"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
