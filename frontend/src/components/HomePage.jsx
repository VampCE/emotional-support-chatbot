import React from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ color: "#6c5ce7" }}>Emotion Bot 🤖</h1>
        <p style={{ color: '#636e72', marginBottom: '20px' }}>
         Here for Make you feel better.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: 'linear-gradient(to right, #74b9ff, #a29bfe)',
              color: 'white',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = 0.9}
            onMouseLeave={(e) => e.target.style.opacity = 1}
          >
            Log in
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              background: 'linear-gradient(to right, #55efc4, #81ecec)',
              color: 'white',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = 0.9}
            onMouseLeave={(e) => e.target.style.opacity = 1}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
