const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const User = require("../models/user");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

// view all products
router.get("/products", async (req, res) => {
	try {
		const products = await Product.find({});
		res.render("products/index", { products });
	} catch (err) {
		req.flash("error", "Can not find products!!!");
		res.redirect("/error");
	}
});

// form - add new product
router.get("/products/new", isLoggedIn, (req, res) => {
	res.render("products/newForm");
});

// add new product to the database
router.post("/products", async (req, res) => {
	try {
		const { product } = req.body;
		// console.log(product);
		await Product.create(product);
		req.flash("success", "Product Added Successfully!");
		res.redirect("/products");
	} catch (err) {
		req.flash("error", "Can't add new product, Something is wrong!!!");
		res.redirect("/error");
	}
});

// show a particular product
router.get("/products/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id).populate("reviews");
		// console.log(product);
		res.render("products/singleProduct", { product });
	} catch (err) {
		req.flash("error", "This particualr product does not exist!!!");
		res.redirect("/error");
	}
});

// form- edit a particular product
router.get("/products/:id/edit", isLoggedIn, async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);
		res.render("products/editForm", { product });
	} catch (err) {
		req.flash("error", "Can not edit this product!!!");
		res.redirect("/error");
	}
});

// update a particular product
router.patch("/products/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await Product.findByIdAndUpdate(id, req.body.product);
		req.flash("success", "Product Updated Successfully!");
		res.redirect(`/products/${id}`);
	} catch (err) {
		req.flash("error", "Can not update this product!!!");
		res.redirect("/error");
	}
});

// DELETE a particular product item
router.delete("/products/:id", isLoggedIn, async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		// deleting the product from the user cart if present
		for (let item of req.user.cart) {
			if (item.product.toString() === req.params.id) {
				await User.findByIdAndUpdate(req.user._id, {
					$pull: { cart: { product: req.params.id } },
				});
				break;
			}
		}

		// also deleting the reviews associated with that product
		await Review.deleteMany({ _id: { $in: product.reviews } });
		req.flash("success", "Product Deleted Successfully!");
		res.redirect("/products");
	} catch (err) {
		req.flash("error", "Can not delete this product!!!");
		res.redirect("/error");
	}
});

// post route for adding new review to the reviews collection
// and also storing the id of that review to that particular product
router.post("/products/:id/review", isLoggedIn, async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		const review = new Review({
			...req.body,
			user: req.user.username,
		});

		product.reviews.push(review);

		await review.save();

		// cause this is just a copy and its Product.prototype
		await product.save();

		req.flash("success", "Comment Added Successfully!");

		res.redirect(`/products/${req.params.id}`);
	} catch (err) {
		req.flash("error", "Can not add review to this product!!!");
		res.redirect("/error");
	}
});

router.get("/error", (req, res) => {
	res.status(404).render("errorPage");
});

module.exports = router;
