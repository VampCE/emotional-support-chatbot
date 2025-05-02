import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const interestOptions = [
  "Mind", "Fitness", "Music", "Movies", "Career", "Growth",
  "Style", "Nature", "Tech", "Love", "Social", "Other"
];

const InterestsPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    console.log("📩 Email geldi mi:", storedEmail);
    if (storedEmail) setEmail(storedEmail);
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

    if (!email || selected.length === 0) {
      alert("E-posta ve en az bir ilgi alanı gerekli.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests: selected }),
      });

      const result = await response.text();

      if (response.ok) {
        alert("✅ Your interests have been saved!");
        navigate("/chat");
      } else {
        alert("❌ Registration failed: " + result);
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      alert("❌ A server error occurred.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ color: "#6c5ce7" }}>Help us to know you better</h1>
        <p style={{ color: "#636e72", marginBottom: "20px" }}>
          Let's choose your interests
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
          Done
        </button>
      </div>
    </div>
  );
};

export default InterestsPage;
