const fs = require('fs');
const db = require("../models");
const Post = db.post;


exports.createPost = (req, res, next) => {

	console.log(req.body)
  console.log(req.token)
	
    Post.create({ 
      title: req.body.title,
      body: req.body.body,
      media: req.body.media,
      creator_id: req.token
     })
    .then(() => res.status(201).json({ message: "Post Créé." }))
    .catch((error) => res.status(400).json({ error }));
};

exports.readPost = (req, res, next) => {
  Post.findAll()
  .then(() => res.status(200).json({ message: "Post trouvé" }))
  .catch((error) => res.status(400).json({ error }));
}

exports.updatePost = (req, res, next) => {
  Post.update( { _id: req.params.id }, { ...req.body, _id: req.params.id } )
		.then(() =>	{ res.status(200).json({ message: "Post updated successfully!" })})
		.catch((error) => res.status(400).json({ error }))
}

exports.deletePost = (req, res, next) => {
  let userId = req.body.id;
  let postId = req.body.postId;
  Post.delete({ where: { id: postId }})
  .then(() =>	{ res.status(200).json({ message: "Post deleted successfully!" })})
	.catch((error) => res.status(400).json({ error }))
}
