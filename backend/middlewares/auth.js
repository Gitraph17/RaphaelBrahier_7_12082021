// MIDDLEWARE DE CONTROLE D'AUTORISATION PAR TOKEN

// Imports
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.getUserIdFromToken  = (req) => {
    const token = req.cookies['userToken'];
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_KEY);
    const tokenUserId = decodedToken.userId;
    return tokenUserId;
}

module.exports.authentication= (req, res, next) => {
  const cookieUserId = req.cookies['userId'];
  if (!req.headers.cookie) {
    res.status(401).end("Requête non authentifiée: absence de cookie d'authentification.");
  } else {
    IDTOKEN = this.getUserIdFromToken(req, res)
    try {
      if (cookieUserId != IDTOKEN) {
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