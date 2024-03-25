const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const handleFactory = require('./handleFactory');

class ReviewController {
  // getAllReview = catchAsync(async (req, res, next) => {
  //   const newQuery = { ...req.query };
  //   if (req.params.tourId) newQuery.tour=req.params.tourId;

  //   const feature = new APIFeatures(Review, newQuery)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginate();

  //   const allReview = await feature.query;
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       reviews: allReview,
  //     },
  //   });
  // });


  setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };

  getAllReview = handleFactory.getAll(Review);
  getReview = handleFactory.getOne(Review);
  updateReview = handleFactory.updateOne(Review);
  createReview = handleFactory.createOne(Review);
  deleteReview = handleFactory.deleteOne(Review);
}
module.exports = new ReviewController();
