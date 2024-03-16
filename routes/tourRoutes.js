const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();
// router.param('id',tourController.checkId)


router.route('/topTour').get(tourController.getToptour,tourController.getAllTours);
router.route('/tour-stats').get(tourController.getToursStats);
router.route('/month-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
