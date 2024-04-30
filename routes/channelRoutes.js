const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");
const authMiddleware = require("../middleware/authHandler");

router.use(authMiddleware);

router.post("/create", channelController.create);
router.post("/list", channelController.list);

module.exports = router;
