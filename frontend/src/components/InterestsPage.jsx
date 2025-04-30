import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitInterests } from "../services/api";
import "./styles.css";

const interestOptions = [
    "Mind",         // Mental health, psychology
    "Fitness",      // Sports & movement
    "Music",        // All music types
    "Movies",       // Films & series
    "Career",       // Job & goals
    "Growth",       // Personal development
    "Style",        // Fashion & trends
    "Nature",       // Flowers & outdoors
    "Tech",         // Science & gadgets
    "Love",         // Relationships
    "Social",       // Confidence, anxiety
    "Other"         // Not listed
  ];

const InterestsPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || selected.length === 0) {
        alert("E-posta ve en az bir ilgi alanı gerekli.");
        return;
      }

      await submitInterests(email, selected);
      alert("İlgi alanların kaydedildi!");
      navigate("/chat");
    } catch (error) {
      console.error("İlgi alanı gönderme hatası:", error);
      alert("Bir hata oluştu!");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ color: "#6c5ce7" }}>Help us to know you better</h1>
        <p style={{ color: "#636e72", marginBottom: "20px" }}>
          lets choose your interest
        </p>

        <div className="interests-grid">
          {interestOptions.map((item) => (
            <div
              key={item}
              className={`interest-item ${selected.includes(item) ? "selected" : ""}`}
              onClick={() => toggleInterest(item)}
            >
              {item}
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
          done
        </button>
      </div>
    </div>
  );
};

export default InterestsPage;
