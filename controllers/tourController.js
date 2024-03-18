const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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

  getAllTours = catchAsync(async (req, res) => {
    const features = new APIFeatures(Tour, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const allTours = await features.query;
    res.status(200).json({
      status: 'success',
      data: {
        tours: allTours,
      },
    });
  });

  getTour = catchAsync(async (req, res) => {
    console.log(req.params.id);
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tours: tour,
      },
    });
  });
  createTour = catchAsync(async (req, res) => {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    });
  });

  updateTour = catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  });

  deleteTour = catchAsync(async (req, res) => {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  });

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
    console.log(year);
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
}

module.exports = new TourController();
