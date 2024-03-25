const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handleFactory = require('./handleFactory');

class TourController {
  checkId = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      next(new appError(`Can't find Id`, 404));
    }
    next();
  });

  getToptour(req, res, next) {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    next();
  }

  getAllTours = handleFactory.getAll(Tour);
  getTour = handleFactory.getOne(Tour, { path: 'reviews' });
  createTour = handleFactory.createOne(Tour);
  updateTour = handleFactory.updateOne(Tour);
  deleteTour = handleFactory.deleteOne(Tour);

  getToursStats = catchAsync(async (req, res) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',

          num: { $sum: 1 },
          numRating: { $sum: '$ratingsAverage' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { maxPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats: stats,
      },
    });
  });

  getMonthlyPlan = catchAsync(async (req, res) => {
    const { year } = req.params;
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          sumTours: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          sumTours: -1,
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  });

  // /tours-within/:distance/center/:latlng/unit/:unit
  // /tours-within/233/center/34.111745,-118.113491/unit/mi
  // 2 api hiện chưa xem nên nếu cần mình sẽ xem clip lại
  getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
      next(
        new appError(
          'Please provide latitutr and longitude in the format lat,lng.',
          400
        )
      );
    }

    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    });
  });

  getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
      next(
        new appError(
          'Please provide latitutr and longitude in the format lat,lng.',
          400
        )
      );
    }

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        data: distances,
      },
    });
  });
}

module.exports = new TourController();
