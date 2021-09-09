// MIDDLEWARE DE CONTROLE D'AUTORISATION PAR JWTOKEN
// SI LA VERIFICATION DU JWTOKEN ECHOUE TOUS LES COOKIES SERVANT A L'AUTHENTIFICATION SONT EFFACES 

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
    try {
      IDTOKEN = this.getUserIdFromToken(req, res)
      if (cookieUserId != IDTOKEN) {
        throw 'Invalid user ID';
      } else {
        next();
      }
    } catch {
      res.clearCookie("isTokenValid");
      res.clearCookie("userToken");
      res.clearCookie("userId");
      res.clearCookie("_csrf");
      res.status(401).json({error: 'Requête non authentifiée'});
    }
  }
};