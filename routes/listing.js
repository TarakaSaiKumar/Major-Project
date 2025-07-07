const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//search
router.get("/search", wrapAsync(listingController.searchData));
//Index Route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route
router.get("/:id",wrapAsync(listingController.showListing));


//create route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing ,wrapAsync(listingController.createListing));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//Update Route
router.put("/:id",isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



module.exports = router;
