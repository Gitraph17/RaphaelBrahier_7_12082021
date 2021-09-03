// ROUTES POST

// Imports
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require("../middlewares/auth")
const multer = require("../middlewares/multer-config");

// Routes
router.post("/", auth.authentication, multer, postCtrl.createPost);
router.get("/", auth.authentication, postCtrl.getAllPosts);
router.get("/likedByUser", auth.authentication, postCtrl.getPostsLikedByUser);
router.delete("/", auth.authentication, postCtrl.deletePost);
router.post("/comment", auth.authentication, multer, postCtrl.createComment);
router.delete("/comment", auth.authentication, postCtrl.deleteComment);
router.post("/like", auth.authentication, multer, postCtrl.addLike);
router.delete("/like", auth.authentication, multer, postCtrl.deleteLike);

module.exports = router;