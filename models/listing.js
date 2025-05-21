//Schema for listing in AirBnb

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js')

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2021/11/11/07/02/nature-6785521_1280.jpg",
        set: (v)=> v=== ""
        ? "https://cdn.pixabay.com/photo/2021/11/11/07/02/nature-6785521_1280.jpg"
        : v
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        { type: Schema.Types.ObjectId, ref: "Review" }
    ],
    owner: {
        type: Schema.Types.ObjectId, ref: "User"
    }
});

listingSchema.post('findOneAndDelete', async (listing) =>{
    if (listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});


let Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
