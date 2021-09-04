const { Sequelize } = require("sequelize");
require('dotenv').config();
const User = require("../models/user");
const Post = require("../models/post");
const auth = require("../middlewares/auth");
const Comment = require("../models/comment");
const PostLike = require("../models/post_like");
const { deleteImage } =  require('../utils/images_utils');


exports.createPost = (req, res) => {
    const userId = auth.getUserIdFromToken(req, res);
    if(req.file) {
        Post.create({
            user_id: userId,
            content: req.body.content,
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
        })
        .then(() => res.status(201).json({ message: 'Post publié avec succès !' }))
        .catch(error => res.status(400).json(error));
    } else {
        Post.create({
            user_id: userId,
            content: req.body.content,
        })
        .then(() => res.status(201).json({ message: 'Post publié avec succès !' }))
        .catch(error => res.status(400).json(error));
    }
}


exports.getAllPosts = (req, res) => {
    Post.findAll({
        order: [['publication_date', 'DESC'], [Comment, 'publication_date', 'DESC' ]],
        include:[
            { model: User, 
                attributes:['first_name', 'last_name', 'picture_url']
            },
            { model: PostLike }, 
            { model: Comment, 
                attributes:['content', 'user_id', 'publication_date', 'id'], 
                include: {model: User, 
                    attributes:['first_name', 'last_name', 'picture_url']
            }}
        ]
    })
    .then(posts => {res.status(200).json(posts)})
    .catch(error => res.status(400).json(error));
}

exports.deletePost = (req, res) => {
    const userIdFromToken = auth.getUserIdFromToken(req, res)
    User.findOne({ where: { id: userIdFromToken }})
    .then(userDeleting => {
        Post.findOne({ where: { id: req.body.postId }})
        .then(post => {
            if (userIdFromToken === post.user_id || userDeleting.is_admin) {
                deleteImage(post.image_url)
                Post.destroy({ where: { id: post.id }})
                    .then(() => res.status(200).json({ message: 'Votre post à été supprimé avec succès.' }))
                    .catch(error => res.status(400).json(error));
            }
        })
        .catch(error => res.status(400).json(error));
    })
    .catch(error => res.status(400).json(error));
}


exports.createComment = (req, res) => {
    const userId = auth.getUserIdFromToken(req, res);
    Comment.create({
        user_id: userId,
        post_id: req.body.data.postId,
        content: req.body.data.content
    })
    .then(() => res.status(201).json({ message: 'Post publié avec succès !' }))
    .catch(error => res.status(400).json(error));
}

exports.deleteComment = (req, res) => {
    const userIdFromToken = auth.getUserIdFromToken(req, res);
    User.findOne({ where: { id: userIdFromToken }})
    .then(userDeleting => {
        Comment.findOne({ where: { id: req.body.commentId }})
        .then(comment => {
            if (userIdFromToken === comment.user_id || userDeleting.is_admin) {
                Comment.destroy({ where: { id: comment.id }})
                .then(() => res.status(200).json({ message: 'Votre commentaire à été supprimé avec succès.' }))
                .catch(error => res.status(400).json(error));
            }
        })
        .catch(error => res.status(400).json(error));
    })
    .catch(error => res.status(400).json(error));
}

exports.getPostsLikedByUser = (req, res) => {
    const userIdFromToken = auth.getUserIdFromToken(req, res);
    PostLike.findAll({ 
        where: { user_id: userIdFromToken },
        attributes:['post_id']
    })
    .then(postsLikedByUser => {res.status(200).json(postsLikedByUser)})
    .catch(error => res.status(400).json(error));
}

exports.addLike = (req, res) => {
    const userId = auth.getUserIdFromToken(req, res);
    PostLike.create({
        user_id: userId,
        post_id: req.body.data.postId,
        is_like: true
    })
    .then(() => res.status(201).json({ message: 'Post liké avec succès !' }))
    .catch(error => res.status(400).json(error));
}

exports.deleteLike = (req, res) => {
    const userIdFromToken = auth.getUserIdFromToken(req, res);
    PostLike.findOne({ where: { id: req.body.likeId }})
        .then(like => {
            if (userIdFromToken === like.user_id) {
                PostLike.destroy({ where: { id: like.id }})
                    .then(() => res.status(200).json({ message: 'Votre Like à été supprimé avec succès.' }))
                    .catch(error => res.status(400).json(error));
            }
        })
        .catch(error => res.status(400).json(error));
}


    

