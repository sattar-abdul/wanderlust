const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("Connection error:", err);
  });

const sampleReviews = [
  { rating: 5, comment: "Amazing place!" },
  { rating: 4, comment: "Very cozy and clean." },
  { rating: 3, comment: "Decent but a bit noisy." }
];

const init = async () => {
  // 1. Delete all reviews
  await Review.deleteMany({});
  console.log("All reviews deleted");

  // 2. Clear old review references from listings
  await Listing.updateMany({}, { $set: { reviews: [] } });
  console.log("Old review references cleared from listings");

  // 3. Create 3 new reviews for each listing
  const listings = await Listing.find({});
  for (let listing of listings) {
    const reviewIds = [];

    for (let rev of sampleReviews) {
      const review = new Review(rev);
      await review.save();
      reviewIds.push(review._id);
    }

    listing.reviews = reviewIds;
    await listing.save();
  }

  console.log("Each listing now has 3 fresh reviews");
};

init().then(() => mongoose.connection.close());
