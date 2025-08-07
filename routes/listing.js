const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema , reviewSchema} = require("../schema.js");
const { isLoggedIn, isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js")
const multer = require("multer");

const {storage} = require("../cloudConfig.js")
const upload = multer({storage});






//new route
router.get("/new" , isLoggedIn , listingController.renderNewForm)



// Search route
router.get('/search', async (req, res) => {
    const { country } = req.query;
    let results = [];
    if (country && country.trim() !== '') {
        results = await Listing.find({ country: { $regex: country, $options: 'i' } });
    }
    res.render('listings/searchResults', { results, country });
});



router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]") , validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));




//show route


//create route
// CREATE route (with validation added here ⬇️)
router.post("/", validateListing, upload.single("listing[image]"), wrapAsync(listingController.createListing));








//Edit route
router.get("/:id/edits", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



//update Route
// UPDATE route (with validation added here ⬇️)






//delete route






module.exports = router;