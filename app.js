if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //when using local db
const dbUrl = process.env.ATLASDB_URL; //when using cloud db
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(express.json()); // For JSON bodies

//mongo part
main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//express part

//root route: '/listing' is our root
app.get("/", (req, res) => {
  res.redirect("/listing");
});

//session- a session Id will be created for each user
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, //unmodified sessions are updated every 24hr
});

store.on("error", () => {
  console.log("Error in Mongodb session store", err);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, //keeps session for 7days
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

//authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // uses the strategy from passport-local-mongoose

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); //saves user data from session
passport.deserializeUser(User.deserializeUser()); //removes user data from session

app.use((req, res, next) => {
  //saving some info to res.locals so that we can access it on ejs files
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//demo
// app.use("/demouser", async (req,res) =>{
//     let fakeuser = new User({
//         email: "student1@gmail.com",
//         username: "student1"
//     });

//     let registeredUser = await User.register(fakeuser, "helloworld");
//     res.send(registeredUser);
// });

//listing routes
app.use("/listing", listingRouter);

//review routes
app.use("/listing/:id/reviews", reviewRouter);

//user routes
app.use("/", userRouter);

//page not found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
