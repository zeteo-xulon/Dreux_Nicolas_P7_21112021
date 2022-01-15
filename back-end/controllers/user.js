/*----------------------------------------------------------------
													REQUIRE
----------------------------------------------------------------*/
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const passwordSchema = require("../middlewares/password");
const db = require("../models");
const User = db.user;
/*----------------------------------------------------------------
													CONTROLLER
----------------------------------------------------------------*/
//	(1) Check the password requirement, (2) crypt it, (3) and save the user.
exports.signup = (req, res, next) => {
	let passwordIsClear = passwordSchema.validate(req.body.password);
	if(!passwordIsClear){ return res.status(400).json({ error: "The password must be minimum 5 character, 1 uppercase, 1 lowercase, have 2 digits and no space."})};

	if(passwordIsClear){
		bcrypt.hash(req.body.password, 10)
			.then((hash) => {
				User.create({ ...req.body, password: hash })
					.then(() => res.status(201).json({ message: "Utilisateur Créé." }))
					.catch((error) => res.status(400).json({ error }));
			})
			.catch((error) => res.status(500).json({ error }));
		}
};

// Find the user in database, compare the password using bcrypt
exports.login = (req, res, next) => {
	User.findOne({ where: { email: req.body.email }})
		.then((user) => {	
			if (!user) { return res.status(401).json({ error: "User not found !" })};
			bcrypt.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) { return res.status(401).json({ error: "Mot de passe incorrect !" }) };
					res.status(200).json({ id: user.id, token: jwt.sign({	userId: user.id }, process.env.TOKEN, { expiresIn: '24h' })	});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.read = (req, res, next) => {
	console.log('Here is the req.params :' + req.params);
	User.findOne({ where: { id: req.params.id}})
	.then((user) => {
		console.log(user);
		res.status(200).json({...user});
	})
	.catch(err => res.status(404).json({ error: "L'utilisateur n'as pas pu être trouvé."}, { err }));
};


// UPDATE user
exports.update = (req, res, next) => {
	User.findOne({ where:  { id: req.body.id } })
	.then((user) => {
			if(user.id !== req.token) {	return res.status(401).json({ message: 'Not Authorized' })
			} else {
				if(req.body.password){
				let passwordIsClear = passwordSchema.validate(req.body.password);
				if(!passwordIsClear) { return res.status(400).json({ error: "Le mot de passe est incorrect" }, { err })};
				if(passwordIsClear){
				User.findOne({ where: { id: req.body.id }})
				.then((user) => {
						bcrypt.compare(req.body.oldpassword, user.password)
						.then((valid) => {
							if(!valid) { return res.status(401).json({ error: "Les mots de passe ne correspondent pas." }) };
								bcrypt.hash(req.body.password, 10)
								.then((hash) => {
									User.update({ password: hash }, { where: { id: req.body.id }})
									.then(() => res.status(201).json({ message: "Utilisateur modifié."}))
									.catch(err => res.status(403).json({ error: "L'utilisateur n'as pas peu être modifié"}, { err }));
								})
								.catch((error) => res.status(500).json({ error }));
					})
				.catch((error) => res.status(500).json({ error }))	
					.catch(err => res.status(403).json({ error: "L'ancien mot de passe n'est pas correct" }))
				})}
			} else {
				User.update({ ...req.body }, { where: { id: req.body.id }})
				.then(() => res.status(201).json({ message: "Utilisateur modifié."}))
				.catch(err => res.status(403).json({ error: "L'utilisateur n'as pas peu être modifié"}, { err }));
			}}})
	.catch(err => res.status(500).json({ err }));
};

// DELETE user
exports.delete = (req, res, next) => {
			User.findOne({ where: { id: req.body.id}})
				.then((user) => {
					if(user.id !== req.token) {	return res.status(401).json({ message: 'Not Authorized' })
					} else {
						bcrypt.compare(req.body.password, user.password)
						.then((valid) => {
							if(!valid) { return res.status(401).json({ error: "Mot de passe incorrect !" }) };
							if(valid) {
								User.destroy({ where: { email: req.body.email }})
								.then(say => res.status(200).json({ message: "Utilisateur supprimé! "}))
								.catch(err => res.status(400).json({ error: " Suppression échoué." }))
							}
						})
					.catch(err => res.status(400).json({error: "Mot de passe incorrect" }, { err }));
					}})
			.catch(err => res.status(400).json({ error: "Utilisateur non trouvé." }))
};
