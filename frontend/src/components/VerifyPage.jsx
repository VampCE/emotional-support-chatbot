import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/verify/${token}`);
        await response.text();


        if (response.ok) {
          setStatus("success");
          setTimeout(() => navigate("/"), 3000); // 3 sn sonra ana sayfaya dön
        } else {
          setStatus("fail");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("fail");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="container">
      <div className="card">
        {status === "loading" && <p>Verification is in progress...</p>}
        {status === "success" && <p>✅ Your account has been successfully verified! You are being redirected to the home page.</p>}
        {status === "fail" && <p>❌ Invalid or expired verification link.</p>}
      </div>
    </div>
  );
};

export default VerifyPage;
