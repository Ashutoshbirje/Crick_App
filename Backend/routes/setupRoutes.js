const express = require("express");
const router = express.Router();
const setupController = require("../controllers/setupController");

router.post("/setup", setupController.saveSetup);
router.get("/setup", setupController.getSetup);

module.exports = router;