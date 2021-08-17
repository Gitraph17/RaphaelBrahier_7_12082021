const { Sequelize } = require("sequelize");
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require("../models/user");
const Post = require("../models/post");
const auth = require("../middlewares/auth");
const fs = require("fs"); // Gestionnaire de fichiers Node pour gérer les photos. 


exports.createPost = (req, res) => {
    const userId = auth.getUserIdFromToken(req, res);
    Post.create({
        user_id: userId,
        content: req.body.content,
    })
    .then(() => res.status(201).json({ message: 'Post publié avec succès !' }))
    .catch(error => res.status(400).json(error));
}

// POST IMAGE A FAIRE !!!

exports.getAllPosts = (req, res) => {
    Post.findAll()
        .then(posts => {res.status(200).json(posts)})
        .catch(error => res.status(400).json(error));
}

exports.deletePost = (req, res) => {
    Post.destroy({ where: { id: req.body.postId }})
        .then(() => res.status(200).json({ message: 'Votre post à été supprimé avec succès.' }))
        .catch(error => res.status(400).json(error));
}


    

