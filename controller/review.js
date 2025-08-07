const Listing = require("../models/listing");
const Review = require("../models/review");







module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    const review = new Review({
        rating: req.body.review.rating,
        comment: req.body.review.comment
    });

    review.author = req.user._id ;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Successfully created a new review!");

    res.redirect(`/listings/${id}`);
};





module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review!");
    res.redirect(`/listings/${id}`);
}
