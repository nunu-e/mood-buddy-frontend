import React from "react";
import "./StatsCards.css";

const StatsCards = ({ stats, todayEntry }) => {
  const statsData = [
    {
      icon: "📅",
      value:
        stats?.moodDistribution?.reduce(
          (total, mood) => total + mood.count,
          0
        ) || 0,
      label: "Total Entries",
      color: "#667eea",
    },
    {
      icon: "🔥",
      value: stats?.streak?.current || 0,
      label: "Day Streak",
      color: "#ff6b6b",
    },
    {
      icon: "📊",
      value: stats?.averageMood ? `${stats.averageMood}/10` : "0/10",
      label: "Avg. Mood",
      color: "#4ecdc4",
    },
    {
      icon: "😊",
      value: todayEntry ? "Logged" : "Pending",
      label: "Today's Mood",
      color: todayEntry ? "#10b981" : "#f59e0b",
    },
  ];

  return (
    <div className="stats-grid">
      {statsData.map((stat, index) => (
        <div key={index} className="stat-card">
          <div
            className="stat-icon"
            style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
          >
            {stat.icon}
          </div>
          <div className="stat-info">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
