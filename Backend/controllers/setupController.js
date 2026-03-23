const Setup = require("../models/Setup");

// ---------------- SAVE SETUP ----------------
exports.saveSetup = async (req, res) => {
  try {
    const { admin, info, venue } = req.body;

    let setup = await Setup.findOne();

    if (!setup) {
      setup = new Setup();
    }

    if (admin) setup.admin = admin;
    if (info) setup.info = info;
    if (venue) setup.venue = venue;

    await setup.save();

    res.status(200).json({
      success: true,
      message: "Setup saved successfully",
      data: setup,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ---------------- SAVE PHOTOS ----------------
exports.savePhotos = async (req, res) => {
  try {
    const { photos } = req.body;

    if (!photos || photos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No photos provided",
      });
    }

    let setup = await Setup.findOne();

    if (!setup) {
      setup = new Setup();
    }

    // append photos
    setup.photos = [...(setup.photos || []), ...photos];

    await setup.save();

    res.status(200).json({
      success: true,
      message: "Photos saved successfully",
      data: setup,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ---------------- GET FULL SETUP ----------------
exports.getSetup = async (req, res) => {
  try {
    const setup = await Setup.findOne();

    res.status(200).json({
      success: true,
      data: setup,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching setup",
    });
  }
};

// ---------------- GET ONLY PHOTOS ----------------
exports.getPhotos = async (req, res) => {
  try {
    const setup = await Setup.findOne();

    res.status(200).json({
      success: true,
      photos: setup?.photos || [],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching photos",
    });
  }
};

// DELETE PHOTO
exports.deletePhoto = async (req, res) => {
  try {
    const { public_id } = req.params;

    const setup = await Setup.findOne();

    setup.photos = setup.photos.filter(
      (p) => p.public_id !== public_id
    );

    await setup.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};