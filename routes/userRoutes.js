const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);
router.post("/verifyOTP", userController.verifyOTP);
router.post("/resendOTP", userController.resendOTP);
router.post("/login", userController.login);

module.exports = router;
