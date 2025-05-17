const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require('../schema.js');


//data validation for listing using joi
const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
}

//index route
router.get('/',wrapAsync(async (req,res)=>{
    let allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
}));

//create route
router.post('/', validateListing, wrapAsync(async(req,res)=>{
    let listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listing");
}));

//new route
router.get('/new', (req,res)=>{
    res.render('listing/new.ejs');
});

//show route
router.get('/:id', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate('reviews');
    res.render('listing/show.ejs',{listing});
}));

//edit route
router.get('/:id/edit', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('listing/edit.ejs',{listing});
}));

//update route
router.put('/:id', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
}));

//delete route
router.delete('/:id', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listing');
}));

module.exports = router;