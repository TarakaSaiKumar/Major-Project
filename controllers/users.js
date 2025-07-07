const User = require("../models/user");



module.exports.userSignUp =  (req, res) => {
  res.render("users/user");
}

module.exports.usersignedUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ email, username });
    const resgisterUr = await User.register(newuser, password);
    req.login(resgisterUr, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To Wanderlust");
      res.redirect("/listings");
    })
    // console.log(resgisterUr);

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}
  
module.exports.userLogin =(req, res) => {
  res.render("users/login");
}

module.exports.userLoggedin = async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", "Welcome To Wanderlust your logged in! ")
    res.redirect(redirectUrl);
  }

module.exports.userLogout =  (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
}