const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested listing does not exist");
    return res.redirect("/listing");
  }
  res.render("listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  //to get map coordinates from listing.location using maptiler
  const location = req.body.listing.location;
  const maptilerKey = process.env.MAPTILER_KEY;

  const locUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(
    location
  )}.json?key=${maptilerKey}&limit=1`;
  const response = await axios.get(locUrl);

  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.data.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested listing does not exist");
    return res.redirect("/listing");
  }

  let originalImageUrl = listing.image.url;
  let croppedImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");

  res.render("listing/edit.ejs", { listing, croppedImageUrl });
};

module.exports.updateListing = async (req, res) => {
  //updating listing data
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  //updating image if new img comes
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listing");
};

module.exports.searchListing = async (req, res) => {
  let query = req.query.query || "";
  const listings = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { country: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  });
    console.log(listings);
  res.render("listing/search.ejs", {
    query,
    listings,
  });
};
