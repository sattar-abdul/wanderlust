const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");


// post route
router.post('/',
    isLoggedIn,
    validateReview,
    wrapAsync (async(req,res)=>{
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.reviews);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        console.log(newReview);

        await listing.save();
        await newReview.save();

        console.log("new review saved");
        req.flash("success", "New Review Created");
        res.redirect(`/listing/${listing.id}`);
}));

//delete review route
router.delete('/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    wrapAsync( async (req,res)=>{
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review Deleted");
        res.redirect(`/listing/${id}`);
}));

module.exports = router;