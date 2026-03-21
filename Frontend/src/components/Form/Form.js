import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import "./Form.css";

const Form = () => {
  const navigate = useNavigate();

  // Admin
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ✅ UPDATED: info (not league)
  const [info, setInfo] = useState({
    names: "",
    series: "",
    types: "",
  });

  // Venue
  const [venue, setVenue] = useState({
    stadium: "",
    location: "",
    country: "",
  });

  // Photos
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`;

  // ---------------- UPLOAD ----------------
  const handlePhotoUpload = async (files) => {
    try {
      const uploads = Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.REACT_APP_UPLOAD_PRESET
        );

        return fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());
      });

      const results = await Promise.all(uploads);

      const formatted = results.map((r, i) => ({
        name: files[i].name,
        url: r.secure_url,
        public_id: r.public_id,
      }));

      setPhotos((prev) => [...prev, ...formatted]);
    } catch {
      setError("Upload failed");
    }
  };

  // ---------------- SAVE ----------------
  const handleSaveAll = async () => {
    try {
      const payload = { admin, info, venue, photos };

      console.log("PAYLOAD:", payload);

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/setup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      alert("Saved successfully");
      navigate("/score");
    } catch {
      setError("Save failed");
    }
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar style={{ justifyContent: "center" }}>
          <Typography variant="h6">WELCOME</Typography>
        </Toolbar>
      </AppBar>

      <div className="adjusted-container">
        <div className="login-container">
          <div className="login-right">
            <h2 className="admin-title">SETUP PANEL</h2>

            {/* ADMIN */}
            <h4 className="heading">Admin</h4>
            <input
              placeholder="Name"
              value={admin.name}
              onChange={(e) =>
                setAdmin({ ...admin, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              value={admin.email}
              onChange={(e) =>
                setAdmin({ ...admin, email: e.target.value })
              }
            />
            <input
              placeholder="Phone"
              value={admin.phone}
              onChange={(e) =>
                setAdmin({ ...admin, phone: e.target.value })
              }
            />
            <input
              placeholder="Address"
              value={admin.address}
              onChange={(e) =>
                setAdmin({ ...admin, address: e.target.value })
              }
            />

            {/* INFO (LEAGUE) */}
            <h4 className="heading">League</h4>
            <input
              placeholder="League Name"
              value={info.names}
              onChange={(e) =>
                setInfo({ ...info, names: e.target.value })
              }
            />
            <input
              placeholder="Series"
              value={info.series}
              onChange={(e) =>
                setInfo({ ...info, series: e.target.value })
              }
            />
            <input
              placeholder="Type"
              value={info.types}
              onChange={(e) =>
                setInfo({ ...info, types: e.target.value })
              }
            />

            {/* VENUE */}
            <h4 className="heading">Venue</h4>
            <input
              placeholder="Stadium"
              value={venue.stadium}
              onChange={(e) =>
                setVenue({ ...venue, stadium: e.target.value })
              }
            />
            <input
              placeholder="Location"
              value={venue.location}
              onChange={(e) =>
                setVenue({ ...venue, location: e.target.value })
              }
            />
            <input
              placeholder="Country"
              value={venue.country}
              onChange={(e) =>
                setVenue({ ...venue, country: e.target.value })
              }
            />

            {/* PHOTOS */}
            <h4 className="heading">Photos</h4>
            <input
              type="file"
              multiple
              onChange={(e) => handlePhotoUpload(e.target.files)}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {photos.map((p, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <img
                    src={p.url}
                    alt=""
                    width="80"
                    style={{ borderRadius: "8px" }}
                  />
                  <div style={{ fontSize: "12px" }}>{p.name}</div>
                </div>
              ))}
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button className="login-btn" onClick={handleSaveAll}>
              Save All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;