const { Sequelize } = require("sequelize");
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require("../models/user");
const auth = require("../middlewares/auth");
const fs = require("fs"); // Gestionnaire de fichiers Node pour gérer les photos. 

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
      res.statusMessage = "Format d'email incorrect !";
      return res.status(400).json({ message: "Format d'email incorrect !" });
    }
    if (validator.isStrongPassword(req.body.password) === false) {
      res.statusMessage = "Format de mot de passe incorrect ! Le mot de passe doit compter au minimum 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre, et 1 symbole.";
      return res.status(400).json({ message: "Format de mot de passe incorrect ! Le mot de passe doit compter au minimum 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre, et 1 symbole." });
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            User.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
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
                res.statusMessage = "Utilisateur non trouvé !";
                return res.status(401).json({ error: "Utilisateur non trouvé" });
            } 
            bcrypt.compare(req.body.password, user.password)
            .then(valid => { 
                if (!valid) {
                    res.statusMessage = "Erreur: mot de passe incorrect.";
                    return res.status(401).json({ error: "mot de passe incorrect." });
                } else if (valid) {
                    res.status(200).json({userId: user.id, token: jwt.sign({ userId: user.id }, process.env.RANDOM_TOKEN_KEY, { expiresIn: '24h' })});
                }
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error: error }));
}

exports.getProfile= (req, res) => {
    const userId = auth.getUserIdFromToken(req);
    User.findOne({ where: { id: userId }})
        .then(user => {
            res.status(200).json({
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
    if (validator.isEmail(req.body.updatedEmail) === false) {
        res.statusMessage = "Format d'email incorrect !";
        return res.status(400).json({ message: "Format d'email incorrect !" });
      }
      if (validator.isStrongPassword(req.body.updatedPassword) === false) {
        res.statusMessage = "Format de mot de passe incorrect ! Le mot de passe doit compter au minimum 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre, et 1 symbole.";
        return res.status(400).json({ message: "Format de mot de passe incorrect ! Le mot de passe doit compter au minimum 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre, et 1 symbole." });
      }
      bcrypt.hash(req.body.updatedPassword, 10)
          .then(hash => {
            User.update({
                first_name: req.body.updatedFirstName,
                last_name: req.body.updatedLastName,
                email: req.body.updatedEmail,
                password: hash,
                }, 
                { where: { id: userId }}
            )
              .then(() => res.status(201).json({ message: 'Votre profil à été mis à jour avec succès!' }))
              .catch(error => res.status(400).json(error));
          })
          .catch(error => res.status(500).json(error));
      };

exports.updateProfilePicture = (req, res) => {
    const userId = auth.getUserIdFromToken(req);
    User.findOne({ where: { id: userId }})
        .then(user => {
            if (user.picture_url != null) {
                const filename = user.picture_url.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                User.updatePictureUrl(req, res);
                })
            } else {
                User.updatePictureUrl(req, res);
            }
        })
}

exports.deleteUser = (req, res) => {
    const userId = auth.getUserIdFromToken(req);
    User.findOne({ where: { id: userId }})
        .then(user => {
            if (user.picture_url != null) {
                const filename = user.picture_url.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    User.destroy({ where: { id: userId }})
                        .then(() => res.status(200).json({ message: 'Votre profil ainsi que toutes les ressources qui lui sont liées (posts, commentaires, interactions) ont étés supprimés avec succès' }))
                        .catch(error => res.status(400).json(error));
                })
            } else {
                User.destroy({ where: { id: userId }})
                    .then(() => res.status(200).json({ message: 'Votre profil ainsi que toutes les ressources qui lui sont liées (posts, commentaires, interactions) ont étés supprimés avec succès' }))
                    .catch(error => res.status(400).json(error));
            }
        })
}


    

