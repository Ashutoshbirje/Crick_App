const Setup = require("../models/Setup");

// SAVE (overwrite previous)
exports.saveSetup = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { admin, info, venue, photos } = req.body;

    // 🔥 Clear old data (avoids schema conflict)
    await Setup.deleteMany();

    const setup = await Setup.create({
      admin,
      info,
      venue,
      photos,
    });

    res.status(200).json({
      success: true,
      message: "Saved successfully",
      data: setup,
    });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET
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
      message: "Error fetching data",
    });
  }
};