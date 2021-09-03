const { Sequelize } = require("sequelize");
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require("../models/user");
const auth = require("../middlewares/auth");
const Post = require("../models/post");
const { deleteImage } =  require('../utils/images_utils');

// INSCRIPTION: Vérification du format d'email, et du mot de passe qui doit être fort. Cryptage du mot de passe, création d'un nouvel objet User et enregistrement dans la BDD via la méthode "create".
/* Le corps de la reqûete attendu est un objet JSON au format suivant:
{
    "first_name":"Jonh",
    "last_name":"Doe",
    "email":"jonh@doe.com",
    "password":"Azerty123!"
}
*/
exports.signup = (req, res) => {
    if (validator.isEmail(req.body.email) === false) {
      return res.status(400).json({ error: "Format d'email incorrect !" });
    }
    if (validator.isStrongPassword(req.body.password) === false) {
      return res.status(400).json({ error: "Format de mot de passe incorrect ! Le mot de passe doit compter au minimum 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre, et 1 symbole." });
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            User.create({
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                password: hash,
            })
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json(error));
        })
        .catch(error => res.status(500).json(error));
    };


// https://www.youtube.com/watch?v=UzCkSzmEq8E Implémenter CAPTCHA pour se prémunir des attaques par force brute ??
// ADMIN authentification
exports.login = (req, res) => {
    User.findOne({ where: { email: req.body.email }})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Cette adresse email ne correspond à aucun utilisateur" });
            } 
            bcrypt.compare(req.body.password, user.password)
            .then(valid => { 
                if (!valid) {
                    return res.status(401).json({ error: "Identifiants incorrects" });
                } else if (valid) {
                    const token = jwt.sign({ userId: user.id, userEmail:user.email }, process.env.RANDOM_TOKEN_KEY, { expiresIn: '24h' });
                    return res.cookie("isTokenValid", "yes", {httpOnly: false, maxAge:86400000})
                              .cookie("userToken", token, {httpOnly: true, maxAge:86400000})
                              .cookie("userId", user.id, {httpOnly: true, maxAge:86400000})
                              .status(200)
                              .json({ message: "Connexion effectuée avec succès.", userId: user.id, userPictureUrl: user.picture_url, userFirstName: user.first_name, userLastName: user.last_name, userEmail: user.email, userIsAdmin: user.is_admin });
                }
            })
            .catch(error => res.status(500).json({ error: error }));
        })
        .catch(error => res.status(500).json({ error: error }));
}

exports.getProfile= (req, res) => {
    const userId = auth.getUserIdFromToken(req);
    User.findOne({ where: { id: userId }})
        .then(user => {
            res.status(200).json({
                userId: user.id,
                userFirstName: user.first_name, 
                userLastName: user.last_name, 
                userEmail: user.email, 
                userIsAdmin: user.is_admin, 
                userPictureUrl: user.picture_url
            })
        })
        .catch(error => res.status(500).json({ error }));
}


exports.updateProfileInfos= (req, res) => {
    const userId = auth.getUserIdFromToken(req);
    if (req.body.data.email && (validator.isEmail(req.body.data.email) === false)) {
        return res.status(400).json({ message: "Format d'email incorrect !" });
    } else {
        User.update({ 
            first_name: req.body.data.firstName,
            last_name: req.body.data.lastName,
            email: req.body.data.email
            },
            { where: { id: userId }}
        )
        .then(() => res.status(200).json({ message: 'Votre profil a été mis à jour avec succès' }))
        .catch(error => res.status(400).json(error));
    }
};

exports.updatePassword= (req, res) => {
    const userId = auth.getUserIdFromToken(req);
    console.log(req.body.actualPassword)
    User.findOne({ where: { id: userId }})
    .then(user => {
        bcrypt.compare(req.body.actualPassword, user.password)
        .then(valid => { 
            if (!valid) {
                return res.status(401).json({ error: "Mot de passe actuel incorrect." });
            } else if (validator.isStrongPassword(req.body.newPassword) === false) {
                return res.status(400).json({ error: "Format de mot de passe incorrect ! Le mot de passe doit compter au minimum 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre, et 1 symbole." });
            } else if (valid) {
                bcrypt.hash(req.body.newPassword, 10)
                .then(hash => { 
                    User.update({ password: hash }, { where: { id: userId }})
                        .then(() => res.status(200).json({ message: 'Votre mot de passe  a été mis à jour avec succès' }))
                        .catch(error => res.status(400).json(error));
                })
            }
        })
        .catch(error => res.status(500).json({ error: error }));
    })
    .catch(error => res.status(500).json({ error: error }));
};

exports.updateProfilePicture = (req, res) => {
    const userId = auth.getUserIdFromToken(req);
    User.findOne({ where: { id: userId }})
        .then(user => {
            if (user.picture_url != null) {
                deleteImage(user.picture_url)
            } 
            User.updatePictureUrl(req, res);
        })
    .catch(error => res.status(500).json(error));
}

exports.deleteUser = (req, res) => {
    const userId = auth.getUserIdFromToken(req);
    User.findOne({ 
        where: { id: userId },
        include:[{ model: Post, required: false, where: {image_url: {[Sequelize.Op.ne]: null}}, attributes:['image_url']}]
    })
    .then(user => {
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: "Mot de passe incorrect." });
            } else if (valid) {
                if (user.posts.length != 0 && user.picture_url != null ) {
                    user.posts.forEach(post => { deleteImage(post.image_url) });
                    deleteImage(user.picture_url)
                } else if (user.posts.length != 0 && user.picture_url === null) {
                    user.posts.forEach(post => { deleteImage(post.image_url) });
                } else if (user.posts.length === 0 && user.picture_url != null) {
                    deleteImage(user.picture_url)
                } else if (user.posts.length === 0 && user.picture_url === null) {
                    User.deleteOne(userId, res)
                    return
                }
                User.deleteOne(userId, res)
            } 
        })
        .catch(error => res.status(500).json({ error: error }));
    })
    .catch(error => res.status(500).json({ error: error }));
}

exports.logout = (req, res) => {
    try {
        res.clearCookie("isTokenValid");
        res.clearCookie("userToken");
        res.clearCookie("userId");
        res.status(200).json({ message: 'Utilisateur déconnecté avec succès' })
    } catch(error) {
        res.status(400).json(error)
    }    
}

    

