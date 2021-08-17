// ROUTES POST

// Imports
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require("../middlewares/auth")
const multer = require("../middlewares/multer-config");

// Routes
router.post("/", auth.authentication, postCtrl.createPost);
// router.post("/image", auth.authentication, postCtrl.postImage);
router.get("/", auth.authentication, postCtrl.getAllPosts);
router.delete("/", auth.authentication, postCtrl.deletePost);


module.exports = router;