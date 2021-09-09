// ROUTES UTILISATEUR

// Imports
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require("../middlewares/auth")
const multer = require("../middlewares/multer-config");
const reqLimiter = require("../middlewares/reqLimiter")
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

// Routes
router.post("/signup", reqLimiter.signup, userCtrl.signup);
router.post("/login",  reqLimiter.login, userCtrl.login);
router.head("/logout", userCtrl.logout)
router.get("/profile", reqLimiter.getProfile, auth.authentication, userCtrl.getProfile)
router.put("/profile", reqLimiter.updateProfilePicOrInfos, csrfProtection, auth.authentication, userCtrl.updateProfileInfos)
router.put("/profile/password", reqLimiter.updatePassword, csrfProtection, auth.authentication, userCtrl.updatePassword)
router.post("/profile/picture", reqLimiter.updateProfilePicOrInfos, csrfProtection, auth.authentication, multer,  userCtrl.updateProfilePicture)
router.delete("/profile", csrfProtection, auth.authentication, multer, userCtrl.deleteUser)

module.exports = router;