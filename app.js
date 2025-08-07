if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


console.log(process.env.SECRET);



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { listingSchema , reviewSchema} = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {index} = require("./controller/listing.js")


const Review = require("./models/review.js");
const e = require("express");
const { Http2ServerRequest } = require("http2");



// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
//     console.log("Connection successful");
// }
// main().catch(err => console.log(err));

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    console.log("Connecting to DB:", dbUrl); // optional debug
    await mongoose.connect(dbUrl);
}

main()
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.log(" MongoDB connection error:", err));


app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const store = MongoStore.create({
    mongoUrl : dbUrl ,
    crypto: {

        secret : process.env.SECRET,
    },
    touchAfter: 24 * 3600   

});

store.on("error" , () => {
    console.log("Error in mongo session store" , err);
});

const sessionOptions = {
    store ,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true, // prevents client-side JavaScript from accessing the cookie
    }
};




// app.get("/", (req, res) => {
//     res.send("Root is working");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());  
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // make currentUser available in all templates

    next();
});







app.use("/listings", listingRouter);

app.use("/listings/:id/reviews" , reviewRouter );
app.use("/", userRouter);

app.get("/listing", wrapAsync(index));













// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "by the beach",
//         image: "",
//         price: 1200,
//         location : "Calangute , Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


//index route






app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});