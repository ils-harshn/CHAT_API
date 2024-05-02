const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authHandler");

router.use(authMiddleware);

router.post("/:channelId/:spaceId/create", messageController.create);
router.post("/:channelId/:spaceId/getMessages", messageController.getMessages);

module.exports = router;
