import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Photo.css";

const Photo = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/photo`
      );
      const data = await res.json();
      setPhotos(data?.photos || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 delete handler
  const handleDelete = async (public_id) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/photo/${public_id}`,
        { method: "DELETE" }
      );

      // update UI instantly
      setPhotos((prev) =>
        prev.filter((p) => p.public_id !== public_id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="landing-container">
      <AppBar position="fixed" className="appbar">
        <Toolbar>
          <Typography variant="h6">WELCOME</Typography>
        </Toolbar>
      </AppBar>

      <div className="main-content1">
        <div className="profile-container1">
          {photos.map((profile, index) => (
            <div key={index} className="photo-wrapper">
              
              {/* DELETE BUTTON */}
              <IconButton
                className="delete-btn"
                onClick={() => handleDelete(profile.public_id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              <img
                src={profile.url}
                alt={profile.name}
                className="circular-photo"
              />

              <Typography variant="h6" className="profile-name">
                {profile.name?.replace(/\.[^/.]+$/, "")}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photo;