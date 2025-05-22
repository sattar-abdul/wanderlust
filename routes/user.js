const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")

  //signup route
  .get(userController.renderSignupForm)

  //create user route
  .post(wrapAsync(userController.signup));

router
  .route("/login")

  //login route
  .get(userController.renderLoginForm)

  //authenticate user
  .post(
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
