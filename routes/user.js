const express = require("express");
const router = express.Router();
const User = require('../models/user.js')

router.get('/signup',(req, res) =>{
    res.render('users/signup.ejs');
})

router.post('/signup',async(req, res)=>{
    let {username, email, password} = req.body;
    const newUser = new User({
        username: username,
        email: email
    });
    let registeredUser = User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "New User Registered");
    res.redirect("/listing");
});

module.exports = router;