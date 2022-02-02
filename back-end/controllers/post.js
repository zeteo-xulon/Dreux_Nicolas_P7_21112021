const fs = require('fs');
const db = require("../models");
const Post = db.post;

// Create new post
exports.createPost = (req, res, next) => {
  let media = "";
  let alt = "L'utilisateur n'a pas fourni de description à cette image."
  if(req.file){ 
    media = `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`;
    if(req.file.mediaDescription){
    alt = req.file.mediaDescription;
    }
  }
  Post.create({ 
    title: req.body.title,
    text: req.body.text,
    media: media,
    media_description: alt,
    creator_id: req.token
    })
  .then(() => res.status(201).json({ message: "Post Créé." }))
  .catch((error) => res.status(400).json({ error }));
};

// will send all the existing post
exports.readAllPost = (req, res, next) => {
  Post.findAll()
  .then((e) => { res.status(200).json(e) })
  .catch((error) => res.status(400).json({ error }));
}
// Reload an existing post after an Update
exports.readOnePost = (req, res, next) => {
  Post.findAll({ where: { id: req.params.id}})
  .then((e) => { res.status(200).json(e) })
  .catch((error) => res.status(400).json({ error }));
}

// Update existing post
exports.updatePost = (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  Post.findAll({ where: { id: req.body.post_id } })
  .then((e) => {
    let foundPost = { ...e[0].dataValues };
    if(req.token === foundPost.creator_id || req.role === 2 ){
        if(req.file){
          const newMedia = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          const previousMedia = foundPost.media.split('/images/')[1];
          console.log('46')
          console.log(newMedia);
          console.log(previousMedia);
          fs.unlink(`images/${previousMedia}`, () => {
            Post.update({ 
              title: req.body.title,
              text: req.body.text,
              media: newMedia,
              media_description: req.body.media_description
            }, { where: {id: req.body.post_id} })
            .then(() =>	{ res.status(200).json({ message: "Post updated successfully!" })})
            .catch((error) => res.status(400).json({ error }))
          })  
        }else {
          Post.update({
            title: req.body.title,
            text: req.body.text
          }, { where: {id: req.body.post_id } })
          .then(() =>	{ res.status(200).json({ message: "Post updated successfully!" })})
          .catch((error) => res.status(400).json({ error }))
        }
      }else{
        return res.status(400).json({ message: "Vous n'avez pas les privilèges requis pour modifier ce post." });
      }
  })
  .catch(err => res.status(400).json(err))



  
};

exports.deletePost = (req, res, next) => {
  let userId = req.body.id;
  let postId = req.body.postId;
  Post.delete({ where: { id: postId }})
  .then(() =>	{ res.status(200).json({ message: "Post deleted successfully!" })})
	.catch((error) => res.status(400).json({ error }))
}
