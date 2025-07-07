const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
     req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be login to create listing!")
   return res.redirect("/login");
}
next();
}


module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    const  value = req.user;
    if (!listing.owner.equals(value._id)) {
        req.flash("error", "You are not owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewid } = req.params;
    const review = await Review.findById(reviewid);
    const  value = req.user._id;
    if (!review.author._id.equals(value._id)) {
        req.flash("error", "You are not Author this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing =(req, res, next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        const errmsg = error.details.map(el => el.message).join(","); 
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}

module.exports.validateReviews =(req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errmsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}