const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");
const authMiddleware = require("../middleware/authHandler");

router.use(authMiddleware);

router.post("/create", channelController.create);
router.post("/list", channelController.list);
router.post("/:channelId/addMembers", channelController.addMembers);
router.post("/:channelId/getMembers", channelController.getMembers);

module.exports = router;
