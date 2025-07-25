if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport =require("passport");
const LocalStrategy = require("passport-local");



const ExpressError = require("./utils/ExpressError.js");
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const User = require("./models/user.js");
const userRoute = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);

}


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
})

store.on('error', (err) => {
    console.log("error in the mongo session ", err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}




app.use(session(sessionOption));


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy (User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {         //local variable
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/",userRoute);

// app.use("/", (req, res) => {
//     res.send("I am root");
// })

app.all('/*catchall', (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs", { message });
    // res.status(statusCode).send(message);
})

const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

