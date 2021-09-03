const fs = require("fs");

// Supprimer une image
exports.deleteImage = (imageUrl) => {
  const imageName = imageUrl.split("/images/")[1];
  fs.unlink(`images/${imageName}`, (err) => { 
    if (err) {
      throw err
    } else {
    console.log('Image effacée: ' + imageName)
    }
  })
}