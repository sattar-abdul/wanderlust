const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//signup route
router.get("/signup", userController.renderSignupForm);

//create user route
router.post("/signup", wrapAsync(userController.signup));

//login route
router.get("/login", userController.renderLoginForm);

//authenticate user
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true, //sets req.flash("error")
    failureRedirect: "/login",
  }),
  userController.login
);

//logout route
router.get("/logout", userController.logout);

module.exports = router;
