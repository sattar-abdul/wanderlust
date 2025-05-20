const express = require('express');
const router = express.Router();
const User = require('../models/user.js')
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');

//signup route
router.get('/signup',(req, res) =>{
    res.render('users/signup.ejs');
})

//create user route
router.post('/signup', wrapAsync(async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({
            username: username,
            email: email
        });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "New User Registered");
        res.redirect("/listing");
    } catch (err){
        req.flash("error", err.message);
        res.redirect("/signup");
    };
}));

//login route
router.get('/login',(req, res) =>{
    res.render('users/login.ejs');
})

//authenticate user
router.post('/login', passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}),async(req, res) =>{
    req.flash("success", "Welcome back! You are logged in!");
    res.redirect("/listing");
})

//logout route
router.get('/logout',(req, res, next) =>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are Logged out!");
        res.redirect("/listing");
    });
})

module.exports = router;