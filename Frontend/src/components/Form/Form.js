import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import heic2any from "heic2any";
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
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(admin.email)) {
      setError("Invalid email format");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(admin.phone)) {
      setError("Invalid phone number (10 digits, start 6-9)");
      return false;
    }

    setError("");
    return true;
  };

  // ---------------- PHOTO UPLOAD ----------------
  const handlePhotoUpload = async (files) => {
    try {
      if (!files || files.length === 0) return;

      const validFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          let uploadFile = file;

          // HEIC → JPEG
          if (
            file.type === "image/heic" ||
            file.type === "image/heif" ||
            file.name.toLowerCase().endsWith(".heic")
          ) {
            try {
              const blob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8,
              });

              uploadFile = new File(
                [blob],
                file.name.replace(/\.heic/i, ".jpg"),
                { type: "image/jpeg" }
              );
            } catch (err) {
              console.error("HEIC conversion failed:", err);
              return null;
            }
          }

          if (!uploadFile.type.startsWith("image/")) return null;

          if (uploadFile.size > 5 * 1024 * 1024) {
            alert(`${uploadFile.name} > 5MB`);
            return null;
          }

          return uploadFile;
        })
      );

      const uploads = validFiles
        .filter(Boolean)
        .map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            process.env.REACT_APP_UPLOAD_PRESET
          );

          const res = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!data.secure_url) {
            console.error("Cloudinary error:", data);
            return null;
          }

          return {
            name: file.name,
            url: data.secure_url,
            public_id: data.public_id,
          };
        });

      const results = await Promise.all(uploads);
      const filtered = results.filter(Boolean);

      setPhotos((prev) => [...prev, ...filtered]);
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

      alert("Info saved successfully");
    } catch {
      setError("Info save failed");
    }
  };

  // ---------------- SUBMIT PHOTOS ----------------
  const handleSavePhotos = async () => {
    if (photos.length === 0) {
      setError("Upload at least one photo");
      return;
    }

    try {
      setUploading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/photo`,
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
    } finally {
      setUploading(false);
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
            <input placeholder="Name" value={admin.name} onChange={(e) => setAdmin({ ...admin, name: e.target.value })} />
            <input placeholder="Email" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value.trim() })} />
            <input placeholder="Phone" value={admin.phone} onChange={(e) => setAdmin({ ...admin, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
            <input placeholder="Address" value={admin.address} onChange={(e) => setAdmin({ ...admin, address: e.target.value })} />

            {/* LEAGUE */}
            <h4 className="heading">League</h4>
            <input placeholder="League Name" value={info.names} onChange={(e) => setInfo({ ...info, names: e.target.value })} />
            <input placeholder="Short Form" value={info.series} onChange={(e) => setInfo({ ...info, series: e.target.value })} />
            <input placeholder="Match Type" value={info.types} onChange={(e) => setInfo({ ...info, types: e.target.value })} />

            {/* VENUE */}
            <h4 className="heading">Venue</h4>
            <input placeholder="Stadium" value={venue.stadium} onChange={(e) => setVenue({ ...venue, stadium: e.target.value })} />
            <input placeholder="Location" value={venue.location} onChange={(e) => setVenue({ ...venue, location: e.target.value })} />
            <input placeholder="Country" value={venue.country} onChange={(e) => setVenue({ ...venue, country: e.target.value })} />

            {/* ERROR */}
            {error && <p className="error-msg">{error}</p>}

            {/* SUBMIT INFO */}
            <div style={{ margin: "20px 0" }}>
              <button className="login-btn" onClick={handleSubmitSetup} style={{ width: "100%" }}>
                Submit
              </button>
            </div>

            {/* PHOTOS */}
            <h4 className="heading">Photos</h4>
            <input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e.target.files)} />

            {/* PREVIEW WITH SPINNER */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {photos.map((p, i) => (
                <div key={i} style={{ textAlign: "center", position: "relative" }}>
                  
                  {loadingImages[i] !== false && (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        background: "rgba(255,255,255,0.6)",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "3px solid #ccc",
                          borderTop: "3px solid #333",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    </div>
                  )}

                  <img
                    src={p.url}
                    alt=""
                    width="80"
                    style={{ borderRadius: "8px" }}
                    onLoad={() =>
                      setLoadingImages((prev) => ({ ...prev, [i]: false }))
                    }
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
                style={{ width: "100%" }}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;