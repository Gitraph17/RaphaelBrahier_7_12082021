// MIDDLEWARE PERMETTANT DE DEFINIR DES LIMITES DE REQUETES UTILISATEUR POUR CERTAINES ROUTES
// MODULE UTILISE: EXPRESS-RATE-LIMIT
// CES LIMITES PERMETTENT DE REDUIRE LES ATTAQUES PAR FORCE BRUTE

const rateLimit = require("express-rate-limit");

//*****************************LIMITEURS DE REQUETES SUR LES ROUTES UTILISATEUR*****************************

module.exports.signup = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5, 
  handler: function (req, res) {
    return res.status(429).json({
        error: "Trop de requêtes de création de compte effectuées. Veuillez patienter 1h puis ré-essayer."
    })
  }
});

module.exports.login = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10, 
  handler: function (req, res) {
    return res.status(429).json({
        error: 'Trop de requêtes de connexion effectuées. Veuillez patienter 10 minutes puis ré-essayer'
    })
  }
});

module.exports.getProfile = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, 
  handler: function (req, res) {
    return res.status(429).json({
        error: "Trop de requêtes pour accéder aux données du profil ont été effectuées. Veuillez patienter 15minutes puis ré-essayer."
    })
  }
});

module.exports.updatePassword = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  handler: function (req, res) {
    return res.status(429).json({
        error: "Trop de requêtes de modification du mot de passe effectuées. Veuillez patienter 15minutes puis ré-essayer."
    })
  }
});

module.exports.updateProfilePicOrInfos = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  handler: function (req, res) {
    return res.status(429).json({
        error: 'Trop de requêtes de modification des données du profil effectuées. Veuillez patienter 15 minutes puis ré-essayer.'
    })
  }
});

//*******************************LIMITEURS DE REQUETES SUR LES ROUTES POST*******************************
module.exports.createPost = rateLimit({
  windowMs: 60 * 60 * 1000, // 
  max: 5, 
  handler: function (req, res) {
    return res.status(429).json({
        error: 'Trop de requêtes pour créer des posts ont été enregistrées. Veuillez patienter 60 minutes puis ré-essayer.'
    })
  }
});

module.exports.getAllPosts = rateLimit({
  windowMs: 20 * 60 * 1000, 
  max: 100, 
  handler: function (req, res) {
    return res.status(429).json({
        error: 'Trop de requêtes pour accéder aux données des posts ou les actualiser ont été enrégistrées. Veuillez patienter 20 minutes puis ré-essayer.'
    })
  }
});

module.exports.postComment = rateLimit({
  windowMs: 20 * 60 * 1000, 
  max: 10, 
  handler: function (req, res) {
    return res.status(429).json({
        error: 'Trop de requêtes pour publier un commentaire ont été enrégistrées. Veuillez patienter 20 minutes puis ré-essayer.'
    })
  }
});
