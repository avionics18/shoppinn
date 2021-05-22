const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// display signup form
router.get("/register", (req, res) => {
    res.render("auth/signup");
});

// register the new user
router.post("/register", async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
        });
        await User.register(user, req.body.password);
        req.flash("success", "Registered Successfully!");
        res.redirect("/login");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
});

// display login form
router.get("/login", (req, res) => {
    res.render("auth/login");
});

// authenticate the user for login
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", `😎 Welcome ${req.user.username.toUpperCase()}`);
        res.redirect("/products");
    }
);

// logout the user
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged Out Successfully!");
    res.redirect("/login");
});

module.exports = router;
