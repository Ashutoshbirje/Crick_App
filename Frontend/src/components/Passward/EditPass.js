import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import './EditPass.css';

const EditPass = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = async () => {
    setError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Password change failed.");
      } else {
        alert("Password changed successfully!");
        navigate("/score");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h6">WELCOME</Typography>
        </Toolbar>
      </AppBar>

      <div className='adjusted-container'>
        <div className="login-container">
          <div className="login-right">
            <h2 className="admin-title">EDIT PASSWORD</h2>

            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && <p className="error-msg">{error}</p>}

            <button className="login-btn" onClick={handlePasswordChange}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPass;
