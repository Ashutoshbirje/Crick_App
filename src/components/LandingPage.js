import React from "react";
import { useHistory } from "react-router-dom"; // Import useHistory
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import tennisBall from '../Images/Photo1.jpeg';
import Main from '../Images/Main.png';

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
  const history = useHistory(); // Use useHistory

  const handleButtonClick = () => {
    history.push("/form"); // Navigate to the desired route
  };

  return (
    <Box
    sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // height: "100vh",
        textAlign: "center",
        background: "#fff",  // Changed to white
      }}
    >
      {/* Centered Image */}
     <div
         style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
            background: "#fff",  // Changed to white
            marginTop: "30px",
          }}
     >
     <img
        src={Main} // Replace with the path to the uploaded image
        alt="Cricket League"
        style={{ maxWidth: "400px", height: "500px"}}
      />

      {/* Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          marginBottom: "30px",
          backgroundColor: "#007BFF",
          "&:hover": {
            backgroundColor: "#0056b3",
          },
        }}
        onClick={handleButtonClick}
      >
        START NOW
      </Button>
     </div>

      {/* Circular Photo */}
      <CircularPhoto src={tennisBall} alt="Photo Name"   sx={{ marginTop: "50px", marginBottom: "8px"  }}  />
      {/* Paragraph */}
      <Typography
        variant="h2"
        sx={{
          marginTop: "20px",
          fontSize: "1.2rem",
          color: "#333",
        }}
      >
        Ashutosh Birje
      </Typography>
    </Box>
  );
};

export default LandingPage;
