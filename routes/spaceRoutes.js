const express = require("express");
const router = express.Router();
const spaceController = require("../controllers/spaceController");
const authMiddleware = require("../middleware/authHandler");

router.use(authMiddleware);

router.post("/:channelId/create", spaceController.create);
router.post("/:channelId/list", spaceController.list);
router.post("/:channelId/:spaceId/create", spaceController.create);
router.post("/:channelId/:spaceId/addMembers", spaceController.addMembers);

module.exports = router;
