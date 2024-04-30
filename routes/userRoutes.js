const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);
router.post("/verifyOTP", userController.verifyOTP);

module.exports = router;
