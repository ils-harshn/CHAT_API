const express = require("express");
const router = express.Router();
const spaceController = require("../controllers/spaceController");
const authMiddleware = require("../middleware/authHandler");

router.use(authMiddleware);

router.post("/:channelId/create", spaceController.create);
router.post("/:channelId/list", spaceController.list);
router.post("/:channelId/:spaceId/addMembers", spaceController.addMembers);
router.post("/:channelId/:spaceId/getMembers", spaceController.getMembers);
router.post("/:channelId/create2WAY", spaceController.create2WAY);

module.exports = router;
