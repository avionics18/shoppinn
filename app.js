if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const seedDB = require("./seed");
const productRoutes = require("./routes/product");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const userRoutes = require("./routes/user");
const paymentRoutes = require("./payment/payment");

// ===== DATABASE =====
mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log("Connected to database successfully!"))
	.catch((err) => console.log(err.message));

// seed the database
// seedDB();

// ===== CONFIG =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(
	session({
		secret: "weneedsomebettersecret",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(flash());

// initializing passport and sessions for
// storing the users info
app.use(passport.initialize());
app.use(passport.session());

// configuring the passport to use local startegy
passport.use(new LocalStrategy(User.authenticate()));
// .authenticate() generates a function used in local startegy

// serialize user into and out of the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Template Globals
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currentUser = req.user;
	next();
});

// Root Route
app.get("/", (req, res) => {
	res.render("homepage");
});

app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(userRoutes);
app.use(paymentRoutes);

// server
app.listen(process.env.PORT || 3000, () => {
	console.log("Server running successfully");
});
