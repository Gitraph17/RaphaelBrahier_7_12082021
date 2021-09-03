// ROUTES UTILISATEUR

// Imports
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require("../middlewares/auth")
const multer = require("../middlewares/multer-config");

// Routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.head("/logout", userCtrl.logout)
router.get("/profile", auth.authentication, userCtrl.getProfile)
router.put("/profile", auth.authentication, userCtrl.updateProfileInfos)
router.put("/profile/password", auth.authentication, userCtrl.updatePassword)
router.post("/profile/picture", auth.authentication, multer,  userCtrl.updateProfilePicture)
router.delete("/profile", auth.authentication, multer,  userCtrl.deleteUser)

module.exports = router;