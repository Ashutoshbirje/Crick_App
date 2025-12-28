import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Main from "../../Images/Main.png";
import { profiles } from "../data";
import Footer from "../Footer/Footer";
import "./HomePage.css"; // Import the external CSS file

const LandingPage = ({ Admin, setIsAdmin, setNewMatch }) => {
  const navigate = useNavigate();

  const handleButtonClick1 = () => {
    navigate("/score");
  };

  const handleButtonClick4 = () => {
    navigate("/help");
  };

    const handleButtonClick2 = () => {
    navigate("/Toss");
  };

  const handleButtonClick3 = () => {
    navigate("/LoginSignUp");
  };

  useEffect(() => {
    setNewMatch(false);
  }, [setNewMatch]);

  return (
    <div className="landing-container">
      {/* Fixed AppBar */}
      <AppBar position="fixed" className="appbar">
        <Toolbar>
          <Typography variant="h6">{process.env.REACT_APP_TITLE}</Typography>
        </Toolbar>
      </AppBar>

      {/* Scrollable Content */}
      <div className="main-content">
        <div className="centered-image">
          <img src={Main} alt="Cricket League" className="main-img" />
        </div>

        <div className="button-container">
          <Button
            variant="contained"
            className="start-button"
            onClick={handleButtonClick1}
          >
            START
          </Button>

          <Button
            variant="contained"
            className="start-button"
            onClick={handleButtonClick2}
          >
            TOSS
          </Button>
          
          <Button
            variant="contained"
            className="start-button"
            onClick={handleButtonClick4}
          >
            HELP
          </Button>

          <Button
            variant="contained"
            className="start-button"
            onClick={handleButtonClick3}
          >
            ADMIN
          </Button>
        </div>

        {/* Circular Photos and Text */}
        <div className="profile-container">
          {profiles.map((profile, index) => (
            <div key={index}>
              <img
                src={profile.img}
                alt={profile.name}
                className="circular-photo"
              />
              <Typography variant="h6" className="profile-name">
                {profile.name}
              </Typography>
            </div>
          ))}
        </div>
        
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
