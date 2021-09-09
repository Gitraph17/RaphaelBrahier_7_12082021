// ROUTES POST

// Imports
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const postLikeCtrl = require ('../controllers/post_like')
const postCommentsCtrl = require ('../controllers/post_comments')
const auth = require("../middlewares/auth")
const multer = require("../middlewares/multer-config");
const reqLimiter = require("../middlewares/reqLimiter")
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

// Routes
router.post("/", reqLimiter.createPost, csrfProtection, auth.authentication, multer, postCtrl.createPost);
router.get("/", reqLimiter.getAllPosts,  auth.authentication, postCtrl.getAllPosts);
router.get("/likedByUser", auth.authentication, postCtrl.getPostsLikedByUser);
router.delete("/", csrfProtection, auth.authentication, postCtrl.deletePost);

router.post("/comment", reqLimiter.postComment, csrfProtection, auth.authentication, multer, postCommentsCtrl.createComment);
router.delete("/comment", auth.authentication, csrfProtection, postCommentsCtrl.deleteComment);

router.post("/like", csrfProtection, auth.authentication, multer, postLikeCtrl.addLike);
router.delete("/like", csrfProtection, auth.authentication, multer, postLikeCtrl.deleteLike);

module.exports = router;