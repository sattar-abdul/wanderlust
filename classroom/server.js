const express = require("express");
const users = require('./routes/users.js');
const posts = require('./routes/posts.js')
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

app.use(session({secret: "mysuper", resave: false, saveUninitialized: true}));
app.use(flash());

app.get('/register', (req, res)=>{
    let {name = "anonmous"} = req.query;
    req.session.name = name;
    req.flash("success", "User is registered");
    res.redirect(`/hello`);

});

app.get('/hello', (req, res)=>{
    res.render('page.ejs',{name: req.session.name});
})

app.get('/test', (req, res)=>{
    if(req.session.count) req.session.count++;
    else req.session.count = 1;
    res.send(`you send request ${req.session.count} times`);
})



app.get('/getsignedcookie', (req,res)=>{
    res.cookie('made-in', "bharat", {signed:true});
    res.send('signed cookie sent');
});

app.get('/verify',(req,res)=>{
    console.log(req.signedCookies);
    res.send("verfied");
})

app.get('/getcookies', (req, res)=>{
    res.cookie("greet","hello");
    res.cookie("madeby","me");
    res.send("some cookies has been sent");
});

app.get('/greet',(req,res)=>{
    let {name = "user"} = req.cookies;
    res.send(`Hello, ${name}`);
})

app.get('/',(req,res)=>{
    console.log(req.cookies);
    res.send("Root");
})



//users
app.use('/users', users);

//post
app.use('/posts', posts);

app.listen(8000, ()=>{
    console.log("app runnin at 8k");
});