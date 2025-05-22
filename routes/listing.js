const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


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
    listing.owner = req.user._id;
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
    let listing = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate:{
                path: 'author'
            },
        })
        .populate('owner');
    if(!listing){
        req.flash("error", "Requested listing does not exist");
        return res.redirect("/listing");
    }
    res.render('listing/show.ejs',{listing});
}));

//edit route
router.get('/:id/edit',
    isLoggedIn,
    isOwner,
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
    isOwner,
    validateListing,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
}));

//delete route
router.delete('/:id',
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect('/listing');
}));

module.exports = router;