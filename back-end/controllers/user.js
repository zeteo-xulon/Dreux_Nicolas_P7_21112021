/*----------------------------------------------------------------
													REQUIRE
----------------------------------------------------------------*/
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const passwordSchema = require("../middleware/password");
const db = require("./models");
const User = db.user;

/*----------------------------------------------------------------
													CONTROLLER
----------------------------------------------------------------*/
//	(1) Check the password requirement, (2) crypt it, (3) and save the user.
exports.signup = (req, res, next) => {
	let passwordIsClear = passwordSchema.validate(req.body.password);

	if(passwordIsClear){
		bcrypt.hash(req.body.password, 10)
			.then((hash) => {
				User.create({ ...req.body, password: hash })
					.then(() => res.status(201).json({ message: "Utilisateur Créé." }))
					.catch((error) => res.status(400).json({ error }));
			})
			.catch((error) => res.status(500).json({ error }));
	}else {
    let errorMessage = 'The password must be minimum 5 character, 1 uppercase, 1 lowercase, have 2 digits and no space.'
    return res.status(400).json({ error: new Error(errorMessage)});
  };
};

// Find the user in database, compare the password using bcrypt
exports.login = (req, res, next) => {
	User.findAll({ where: { 
		email: req.body.email 
		}})
		.then((user) => {
			console.log(user);
			if (!user) {
				return res.status(401).json({ error: "User not found !" });
			}
			bcrypt.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) { return res.status(401).json({ error: "Mot de passe incorrect !" }) }
					res.status(200).json({ userId: user._id, token: jwt.sign({ userId: user._id }, process.env.TOKEN, { expiresIn: '24h' })	});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
