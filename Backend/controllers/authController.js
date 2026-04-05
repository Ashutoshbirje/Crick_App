const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Setup = require("../models/Setup");

// Ensure default admin exists
const ensureDefaultAdmin = async () => {
  const admin = await Admin.findOne({ username: "admin" });
  if (!admin) {
    const hashed = await bcrypt.hash("12345", 10);
    await Admin.create({ username: "admin", password: hashed });
    console.log("Default admin created with password '12345'");
  }
};

// ---------------- LOGIN -----------------
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) return res.status(404).json({ error: "Admin not found." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password." });

    // -------- GET ADMIN DETAILS FOR EMAIL --------
    const setup = await Setup.findOne();
    const adminDetails = setup?.admin || { name: username, email: admin.email };

    // first name only
    const firstName = adminDetails.name.trim().split(" ")[0];

    // -------- LOAD LOGIN TEMPLATE --------
    const templatePath = path.join(__dirname, "../templates/loginEmail.html");
    let html = fs.readFileSync(templatePath, "utf-8");

    html = html.replace(/{{name}}/g, firstName);

    // -------- SEND EMAIL --------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminDetails.email,
      subject: "Login Successful",
      html,
    });

    res.status(200).json({ message: "Login successful. Email sent." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const adminUser = await Admin.findOne({ username: "admin" });
    if (!adminUser)
      return res.status(404).json({ message: "Admin not found." });

    const isMatch = await bcrypt.compare(oldPassword, adminUser.password);
    if (!isMatch)
      return res.status(401).json({ message: "Old password incorrect." });

    // hash + save
    adminUser.password = await bcrypt.hash(newPassword, 10);
    await adminUser.save();

    // -------- GET ADMIN DETAILS FROM SETUP --------
    const setup = await Setup.findOne();
    if (!setup)
      return res.status(404).json({ message: "Setup data not found." });

    const admin = setup.admin;

    // first name only
    const firstName = admin?.name?.trim().split(" ")[0] || "";

    // -------- LOAD TEMPLATE --------
    const templatePath = path.join(__dirname, "../templates/passwordEmail.html");
    let html = fs.readFileSync(templatePath, "utf-8");

    // -------- REPLACE VARIABLES --------
    html = html
      .replace(/{{name}}/g, firstName)
      .replace(/{{newPassword}}/g, newPassword);

    // -------- MAIL --------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "Password Changed",
      html,
    });

    res.status(200).json({
      message: "Password changed and email sent.",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  login,
  changePassword,
  ensureDefaultAdmin
};
