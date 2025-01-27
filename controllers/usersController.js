// controllers/usersController.js
const usersStorage = require("../storages/usersStorage");
const { check, body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

exports.usersListGet = (req, res) => {
	res.render("index", {
		title: "User list",
		users: usersStorage.getUsers(),
	});
};

exports.usersCreateGet = (req, res) => {
	res.render("createUser", {
		title: "Create user",
	});
};

exports.usersCreatePost = (req, res) => {
	const { firstName, lastName, email } = req.body;
	usersStorage.addUser({ firstName, lastName, email });
	res.redirect("/");
};

const validateUser = [
	body("firstName").trim()
		.isAlpha().withMessage(`First name ${alphaErr}`)
		.isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
	body("lastName").trim()
		.isAlpha().withMessage(`Last name ${alphaErr}`)
		.isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
	// body("email").trim()
	// 	.isAlpha().withMessage(`email ${alphaErr}`)
	// 	.isLength({ min: 1, max: 10 }).withMessage(`email ${lengthErr}`),
	check("email").isEmail().withMessage(`invalid email`),
];

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
	validateUser,
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).render("createUser", {
				title: "Create user",
				errors: errors.array(),
			});
		}
		const { firstName, lastName, email } = req.body;
		usersStorage.addUser({ firstName, lastName, email });
		res.redirect("/");
	}
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email } = req.body;
    usersStorage.updateUser(req.params.id, { firstName, lastName, email });
    res.redirect("/");
  }
];

// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};
