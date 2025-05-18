const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema} = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

//data validation for review using joi
const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
};


// post route
router.post('/',validateReview, wrapAsync (async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();

    console.log("new review saved");
    req.flash("success", "New Review Created");
    res.redirect(`/listing/${listing.id}`);
}));

//delete review route
router.delete('/:reviewId', wrapAsync( async (req,res)=>{
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listing/${id}`);
}));

module.exports = router;