const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};



module.exports.renderNewForm =  (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate: { path : "author"} }).populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listing");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing , currUser : req.user});
};



module.exports.createListing = async (req, res) => {
    let url = req.file.path ;
    let filename = req.file.filename;


    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the currently logged-in user
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listing");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listing");
    }



    let originalImageUrl = listing.image.url ; 
    originalImageUrl =originalImageUrl.replace("/upload", "/upload/h_300,w_250");

    res.render("listings/edit.ejs", { listing , originalImageUrl });
};




module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // Now update
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
    let url = req.file.path ;
    let filename = req.file.filename;

    listing.image = { url , filename };
    await listing.save();
    }

    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};





module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listing");
};