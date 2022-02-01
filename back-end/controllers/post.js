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
exports.readPost = (req, res, next) => {
  Post.findAll()
  .then((e) => { res.status(200).json(e) })
  .catch((error) => res.status(400).json({ error }));
}

exports.updatePost = (req, res, next) => {

  if(req.file){
    fs.unlink()
  }else {
    Post.update( { _id: req.params.id }, { ...req.body, _id: req.params.id } )
		.then(() =>	{ res.status(200).json({ message: "Post updated successfully!" })})
		.catch((error) => res.status(400).json({ error }))
    }
  }


exports.deletePost = (req, res, next) => {
  let userId = req.body.id;
  let postId = req.body.postId;
  Post.delete({ where: { id: postId }})
  .then(() =>	{ res.status(200).json({ message: "Post deleted successfully!" })})
	.catch((error) => res.status(400).json({ error }))
}
