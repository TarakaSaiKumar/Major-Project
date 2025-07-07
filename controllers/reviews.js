const Listing = require("../models/listing")
const Review = require("../models/review")

module.exports.newReview = async(req, res)=>{
   let listing = await Listing.findById(req.params.id);
   let newRev = new Review(req.body.review);
   console.log("Incoming review data:", req.body);
   newRev.author = req.user._id;


   listing.reviews.push(newRev);

   await newRev.save();
   await listing.save();
   req.flash("success","New Review Created!");
   res.redirect(`/listings/${listing._id}`);
}

module.exports.reviewDelete = async(req,res)=>{
    let {id , reviewid}= req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewid}})
   await Review.findByIdAndDelete(reviewid)
   req.flash("success","Deleted Review!");
    res.redirect(`/listings/${id}`);
}