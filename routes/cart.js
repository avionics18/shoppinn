const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");

// Add product to user's cart
router.post("/user/cart/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    const user = req.user;
    if (user.cart.length) {
      let flag = 1;
      for (let item of user.cart) {
        if (item.product.toString() === id) {
          item.qty += 1;
          req.flash("success", "Product added to cart multiple times!");
          flag = 0;
          break;
        }
      }

      if (flag) {
        user.cart.push({ product: product, qty: 1 });
        req.flash("success", "Product added to cart successfully!");
      }
    } else {
      user.cart.push({ product: product, qty: 1 });
      req.flash("success", "Product added to cart successfully!");
    }
    await user.save();
    res.redirect(`/products/${id}`);
  } catch (err) {
    req.flash("error", "Could not add product to cart!");
    res.redirect("/error");
  }
});

// Remove Product from Cart
router.delete("/user/cart/:id", isLoggedIn, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { cart: { product: req.params.id } },
    });
    req.flash("success", "Item removed from cart!");
    res.redirect("/user/cart");
  } catch (err) {
    req.flash("error", "No such product exist!!!");
    res.redirect("/error");
  }
});

// Display Cart
router.get("/user/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    // --- Price Calculation Logic ---
    let subTotal = 0,
      total = 0,
      shippingCharge = 232,
      tax = 0,
      taxRate = 0;
    if (user.cart.length) {
      for (let item of user.cart) {
        subTotal += item.product.price;
      }
      if (subTotal > 7500) {
        taxRate = 18;
        tax = Math.round(subTotal * 0.18);
      } else {
        taxRate = 12;
        tax = Math.round(subTotal * 0.12);
      }
      const total = subTotal + tax + shippingCharge;
      res.render("cart/showCart", {
        userCart: user.cart,
        subTotal,
        shippingCharge,
        tax,
        taxRate,
        total,
      });
    } else {
      res.render("cart/showCart", { userCart: user.cart });
    }
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/error");
  }
});

module.exports = router;
