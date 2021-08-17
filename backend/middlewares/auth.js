// MIDDLEWARE DE CONTROLE D'AUTORISATION PAR TOKEN

// Imports
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.getUserIdFromToken  = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_KEY);
    const userId = decodedToken.userId;
    return userId;
}

module.exports.authentication= (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).end("Requête non authentifiée: absence de token.");
  } else {
  this.getUserIdFromToken(req, res);
    try {
      if (req.body.userId && req.body.userId !== userId) {
        throw 'Invalid user ID';
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  }
};