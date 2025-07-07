const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router.get("/signup", userController.userSignUp)

//signup
router.post("/signup", wrapAsync(userController.usersignedUp))

//login
router.get("/login", userController.userLogin)

router.post('/login', saveRedirectUrl,
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  userController.userLoggedin)


router.get("/logout", userController.userLogout);

module.exports = router;