const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authHandler");

router.post("/signup", userController.signup);
router.post("/verifyOTP", userController.verifyOTP);
router.post("/resendOTP", userController.resendOTP);
router.post("/login", userController.login);
router.post("/profile", authMiddleware, userController.profile);

module.exports = router;
