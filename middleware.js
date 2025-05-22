const Listing = require("./models/listing.js");
const {listingSchema, reviewSchema} = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl =  req.originalUrl;
        req.flash("error", "You must be logged In!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner)){
        req.flash("error", "You don't have permission!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

//data validation for listing using joi
module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
}

//data validation for review using joi
module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
};