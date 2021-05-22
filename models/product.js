const mongoose = require("mongoose");
const Review = require("./review");

// product schema
const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	img: {
		type: String,
	},
	price: {
		type: Number,
		min: 0,
	},
	desc: {
		type: String,
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

// product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
