const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const { validateReviews } = require("../middleware.js")


//reviews
router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewController.newReview));

//delete 
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.reviewDelete));


module.exports = router;