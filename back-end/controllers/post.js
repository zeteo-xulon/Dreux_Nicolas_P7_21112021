const fs = require('fs');
const db = require("../models");
const Post = db.post;
const Comment = db.comment;
const User = db.user;

// Create new post
exports.createPost = (req, res, next) => {
  let media = "";
  let alt = "L'utilisateur n'a pas fourni de description à cette image."
  if(req.file){ 
    media = `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`;
    if(req.file.mediaDescription){
    alt = req.file.mediaDescription;
    }
  }else {
    alt = "";
  }
  Post.create({ 
    title: req.body.title,
    text: req.body.text,
    media: media,
    media_description: alt,
    userId: req.token
    })
  .then(() => res.status(201).json({ message: "Post Créé." }))
  .catch((error) => res.status(400).json({ error }));
};

// will send all the existing post
exports.readAllPost = (req, res, next) => {
  Post.findAll({ include: [{ model: User }, { model: Comment, include: { model: User } }]})
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
  Post.findAll({ where: { id: req.params.id } })
  .then((e) => {
    let foundPost = { ...e[0].dataValues };
    console.log(`req.role is == ${req.role}`)
    if(req.token === foundPost.userId || req.role === 2 ){
        if(req.file){
          const newMedia = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          const previousMedia = foundPost.media.split('/images/')[1];
          fs.unlink(`images/${previousMedia}`, () => {
            Post.update({ 
              title: req.body.title,
              text: req.body.text,
              media: newMedia,
              media_description: req.body.media_description
            }, { where: {id: req.params.id} })
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
  Post.findAll({ where: { id: req.params.id } })
  .then((event) => {
    let foundPost = { ...event[0].dataValues };
    //verif user privilege
    if(req.token === foundPost.userId || req.role === 2){
      // Delete the picture if there is one
      if(foundPost.media){
        const mediaToDelete = foundPost.media.split('/images/')[1];
        fs.unlink('images/' + mediaToDelete, () => {
          Post.destroy({ where: { id: req.params.id }})
          .then(() =>	{ res.status(200).json({ message: "Post deleted successfully!" }) })
          .catch((error) => res.status(400).json({ error })) 
        })} else {
        Post.destroy({ where: { id: req.params.id }})
        .then(() =>	{ res.status(200).json({ message: "Post deleted successfully!" }) })
        .catch((error) => res.status(400).json({ error })) 
        }
    }else{ res.status(400).json({ message: "Vous n'avez pas les privilèges requis pour suppriemr ce message."})}
  })
  .catch((err) => res.status(400).json({ err }));
}
