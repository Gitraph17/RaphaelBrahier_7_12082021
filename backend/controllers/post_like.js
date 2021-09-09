// CONTROLEURS DES ROUTES D'AJOUT ET DE SUPPRESSION DE LIKE

const PostLike = require("../models/post_like");
const auth = require("../middlewares/auth");

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
  const userId = auth.getUserIdFromToken(req, res);
  PostLike.findOne({ where: { id: req.body.likeId }})
      .then(like => {
          if (userId === like.user_id) {
              PostLike.destroy({ where: { id: like.id }})
                  .then(() => res.status(200).json({ message: 'Votre Like à été supprimé avec succès.' }))
                  .catch(error => res.status(400).json(error));
          }
      })
      .catch(error => res.status(400).json(error));
}