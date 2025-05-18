const express = require("express");
const mongoose = require("mongoose");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); 
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');

const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');

const app = express();
const port = 3000;

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsMate);


//mongo part
main()
    .then((res)=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });


async function main() {
    await mongoose.connect(MONGO_URL);
};


//express part
//root route
app.get('/',(req,res)=>{
    res.send("Hi, I am root");
});


//session 
app.use(session({
    secret: "mySuperSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, //keeps session for 7days
        httpOnly: true
    }
}));
app.use(flash());

app.use((req, res, next)=>{
    //flash mai "success" agar aata hai to usko res.locals mai save kardo
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//listing routes
app.use('/listing', listings);


//review routes
app.use('/listing/:id/reviews', reviews);


//page not found
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
  });


//error handling middleware
app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "something went wrong!"} = err;
    res.status(statusCode).render('error.ejs',{message});
    // res.status(statusCode).send(message);
});


app.listen(port, ()=>{
    console.log(`app is running at ${port}`);
});