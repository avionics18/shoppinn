const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

router.get("/profile", isLoggedIn, async (req, res) => {
	const reviews = await Review.find({ user: req.user.username });
	res.render("user/index", { user: req.user, reviews: reviews });
});

module.exports = router;
