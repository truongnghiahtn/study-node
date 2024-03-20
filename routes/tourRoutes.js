const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();
router.param('id',tourController.checkId);


router.route('/topTour').get(tourController.getToptour,tourController.getAllTours);
router.route('/tour-stats').get(tourController.getToursStats);
router.route('/month-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(authController.protect,tourController.getAllTours)
  .post(authController.protect,authController.restrictTo('lead-guide','admin'),tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
