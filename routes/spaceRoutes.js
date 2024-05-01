const express = require("express");
const router = express.Router();
const spaceController = require("../controllers/spaceController");
const authMiddleware = require("../middleware/authHandler");

router.use(authMiddleware);

router.post("/:channelId/create", spaceController.create);

module.exports = router;
