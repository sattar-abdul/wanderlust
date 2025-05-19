const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require('../schema.js');
const { isLoggedIn } = require("../middleware.js");


//data validation for listing using joi
const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
}

//listing route
router.get('/',wrapAsync(async (req,res)=>{
    let allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
}));

//create route
router.post('/',
    isLoggedIn,
    validateListing,
    wrapAsync(async(req,res)=>{
    let listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listing");
}));

//new route
router.get('/new',
    isLoggedIn,
    (req,res)=>{
        res.render('listing/new.ejs');
    }
);

//show route
router.get('/:id', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate('reviews');
    if(!listing){
        req.flash("error", "Requested listing does not exist");
        return res.redirect("/listing");
    }
    res.render('listing/show.ejs',{listing});
}));

//edit route
router.get('/:id/edit',
    isLoggedIn,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Requested listing does not exist");
        return res.redirect("/listing");
    }
    res.render('listing/edit.ejs',{listing});
}));

//update route
router.put('/:id',
    isLoggedIn,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
}));

//delete route
router.delete('/:id',
    isLoggedIn,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect('/listing');
}));

module.exports = router;