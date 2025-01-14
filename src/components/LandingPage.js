import React from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, AppBar, Typography, Toolbar } from "@mui/material";
import { styled } from "@mui/system";
import Main from "../Images/Main.png";
import { profiles } from "./data"; // Import the data array

const CircularPhoto = styled("img")({
  width: "250px",
  height: "250px",
  borderRadius: "50%",
  transition: "transform 0.3s ease-in-out",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
  },
});

const LandingPage = () => {
  const history = useHistory();

  const handleButtonClick = () => {
    history.push("/form");
  };

  return (
    <div>
      {/* Fixed AppBar */}
      <AppBar position="fixed">
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#3f51b5",
          }}
        >
          <Typography variant="h6">Welcome</Typography>
        </Toolbar>
      </AppBar>

      {/* Scrollable Content */}
      <Box
        sx={{
          marginTop: "64px", // Offset for AppBar height
          overflowY: "auto",
          height: "calc(100vh - 64px)", // Adjust height to make content scrollable
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px",
            background: "#fff",
          }}
        >
          {/* Centered Image */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <img
              src={Main}
              alt="Cricket League"
              style={{ maxWidth: "400px", height: "400px" }}
            />
          </div>

          {/* Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              marginBottom: "100px",
              backgroundColor: "#3f51b5",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
            onClick={handleButtonClick}
          >
            START NOW
          </Button>
          
          {/* Circular Photos and Text */}
          <div>
      {profiles.map((profile, index) => (
        <div key={index}>
          <CircularPhoto
            src={profile.img}
            alt={`Photo of ${profile.name}`}
            sx={{ marginBottom: "8px" }}
          />
          {console.log(profile)}
          <Typography
            variant="h2"
            sx={{
              marginTop: "15px",
              marginBottom: "40px",
              fontSize: "1.2rem",
              color: "#333",
            }}
          >
            {profile.name}
          </Typography>
        </div>
      ))}
    </div>
        </Box>
      </Box>
    </div>
  );
};

export default LandingPage;
