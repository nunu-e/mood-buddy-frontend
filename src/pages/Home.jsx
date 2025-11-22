import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: "😊",
      title: "Daily Mood Tracking",
      description: "Log your mood every day and track your emotional journey",
    },
    {
      icon: "📝",
      title: "Journal Entries",
      description: "Write about your day and reflect on your thoughts",
    },
    {
      icon: "📈",
      title: "Visual Analytics",
      description: "See your mood patterns with beautiful charts and insights",
    },
    {
      icon: "🔒",
      title: "Private & Secure",
      description: "Your data is encrypted and only accessible to you",
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Track Your Mood,
            <span className="gradient-text"> Understand Yourself</span>
          </h1>
          <p className="hero-description">
            Moodbuddy helps you track your daily emotions, write journal
            entries, and discover patterns in your mental well-being.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-large">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="mood-cards-preview">
            <div className="preview-card">😊 Happy</div>
            <div className="preview-card">😐 Neutral</div>
            <div className="preview-card">😔 Sad</div>
            <div className="preview-card">😰 Anxious</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose Moodbuddy?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta">
          <div className="cta-content">
            <h2>Start Your Journey Today</h2>
            <p>Join thousands of users tracking their mental well-being</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Create Your Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
