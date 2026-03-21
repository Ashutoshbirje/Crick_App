    const express = require("express");
    const router = express.Router();
    const matchController = require("../controllers/matchController");

    router.post("/", matchController.createMatch);
    router.get("/", matchController.getAllMatches);
    router.patch('/:matchId/toggle', matchController.toggleNewMatch);
    router.patch("/:matchId/type", matchController.updateMatchType);

    module.exports = router;
