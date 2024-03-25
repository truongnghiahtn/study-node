const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();
router.param('id', tourController.checkId);

router
  .route('/topTour')
  .get(tourController.getToptour, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getToursStats);
router.route('/month-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

//Post:router/:tourId/reviews
//get:router/:tourId/reviews
//get:router/:tourId/reviews/:id
// router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview);

// chuyển bộ định hướng router.
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
