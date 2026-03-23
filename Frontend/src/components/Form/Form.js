import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import "./Form.css";

const Form = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [info, setInfo] = useState({
    names: "",
    series: "",
    types: "",
  });

  const [venue, setVenue] = useState({
    stadium: "",
    location: "",
    country: "",
  });

  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [setupSaved, setSetupSaved] = useState(false);

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`;

  // ---------------- VALIDATION ----------------
  const validateSetup = () => {
    if (
      !admin.name ||
      !admin.email ||
      !admin.phone ||
      !admin.address ||
      !info.names ||
      !info.series ||
      !info.types ||
      !venue.stadium ||
      !venue.location ||
      !venue.country
    ) {
      setError("All fields are mandatory");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(admin.email)) {
      setError("Invalid email format");
      return false;
    }

    // Phone validation (India)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(admin.phone)) {
      setError("Invalid phone number (must be 10 digits starting with 6-9)");
      return false;
    }

    setError("");
    return true;
  };

  // ---------------- PHOTO UPLOAD ----------------
  const handlePhotoUpload = async (files) => {
    try {
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) return false;
        if (file.size > 5 * 1024 * 1024) {
          alert("Max size 5MB");
          return false;
        }
        return true;
      });

      const uploads = validFiles.map((file) => {
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

      const formatted = results
        .filter((r) => r.secure_url)
        .map((r, i) => ({
          name: validFiles[i].name,
          url: r.secure_url,
          public_id: r.public_id,
        }));

      setPhotos((prev) => [...prev, ...formatted]);
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    }
  };

  // ---------------- SUBMIT INFO ----------------
  const handleSubmitSetup = async () => {
    if (!validateSetup()) return;

    try {
      const payload = { admin, info, venue };

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/setup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      setSetupSaved(true);
      alert("Info saved successfully");
    } catch {
      setError("Info save failed");
    }
  };

  // ---------------- SUBMIT PHOTOS ----------------
  const handleSavePhotos = async () => {
    if (!setupSaved) {
      setError("Please submit info first");
      return;
    }

    if (photos.length === 0) {
      setError("Upload at least one photo");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/photos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos }),
        }
      );

      if (!res.ok) throw new Error();

      alert("Photos saved successfully");
      navigate("/score");
    } catch {
      setError("Photo save failed");
    }
  };

  // ---------------- UI ----------------
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
                setAdmin({
                  ...admin,
                  email: e.target.value.trim(),
                })
              }
            />
            <input
              placeholder="Phone"
              value={admin.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setAdmin({ ...admin, phone: value });
              }}
            />
            <input
              placeholder="Address"
              value={admin.address}
              onChange={(e) =>
                setAdmin({ ...admin, address: e.target.value })
              }
            />

            {/* LEAGUE */}
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

            {/* ERROR */}
            {error && <p className="error-msg">{error}</p>}

            {/* SUBMIT INFO */}
            <div style={{ margin: "20px 0" }}>
              <button
                className="login-btn"
                onClick={handleSubmitSetup}
                style={{ width: "100%" }}
              >
                Submit
              </button>
            </div>

            {/* PHOTOS */}
            <h4 className="heading">Photos</h4>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handlePhotoUpload(e.target.files)}
            />

            {/* PREVIEW */}
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

            {/* SUBMIT PHOTOS */}
            <div style={{ marginTop: "20px" }}>
              <button
                className="login-btn"
                onClick={handleSavePhotos}
                disabled={!setupSaved}
                style={{ width: "100%" }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;