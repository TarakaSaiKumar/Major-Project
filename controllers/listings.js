const Listing = require("../models/listing");



module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index", { allListings });
}


module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");

}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}

// module.exports.createListing = async (req, res, next) => {
//     let url = req.file.path;
//     let filename = req.file.filename;
//  const newListings = new Listing(req.body.listing);
//   newListings.owner = req.user._id;
//   newListings.image = {url, filename};
//     await newListings.save();
//     req.flash("success","New Listing Created!");
//     res.redirect("/listings");

// }

module.exports.createListing = async (req, res, next) => {
  const maptilersdk = await import('@maptiler/sdk');
  maptilersdk.config.apiKey = process.env.MAP_API_KEY;

  let url = req.file.path;
  let filename = req.file.filename;

  // Geocode address
  const geoResponse = await maptilersdk.geocoding.forward(req.body.listing.location);
  const coordinates = geoResponse?.features?.[0]?.geometry?.coordinates;
  console.log("📌 Extracted coordinates:", coordinates);


  if (!coordinates) {
    req.flash("error", "Location not found.");
    return res.redirect("/listings/new");
  }

  const newListings = new Listing(req.body.listing);
  newListings.owner = req.user._id;
  newListings.image = { url, filename };
  newListings.geometry = {
    type: "Point",
    coordinates: coordinates // already in [lng, lat] format
  };
  await newListings.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250");
  console.log(originalImageUrl);
  res.render("listings/edit", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Updated Listing!");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Listing!");
  res.redirect("/listings");
}

module.exports.searchData = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    req.flash("error", "Please enter a search term.")
    return res.redirect("/listings");
  }
  const searchResults = await Listing.find({
    $or: [ // Search in either title, description, location, OR country
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } }, 
      { country: { $regex: query, $options: 'i' } }
    ]
     
  });
res.render("listings/result", { listings: searchResults, searchQuery: query });
}
