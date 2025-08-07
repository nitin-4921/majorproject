const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    location: Joi.string().min(1).required(),
    country: Joi.string().min(1).required(),
    price: Joi.number().required().min(0),

    // ✅ Optional image object
    image: Joi.object({
      url: Joi.string().uri(),
      filename: Joi.string()
    }).optional()
    
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().min(1).required(),
  }).required(),
});
