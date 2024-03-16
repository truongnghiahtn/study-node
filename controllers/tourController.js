const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

class TourController {
  getToptour(req, res, next) {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    next();
  }

  async getAllTours(req, res) {
    try {
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
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: ' Invalid',
      });
    }
  }

  async getTour(req, res) {
    try {
      console.log(req.params.id);
      const tour = await Tour.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: {
          tours: tour,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: ' Invalid id',
      });
    }
  }

  async createTour(req, res) {
    try {
      const newTour = await Tour.create(req.body);
      res.status(400).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'Fail',
        message: 'Invalid data sent',
      });
    }
  }

  async updateTour(req, res) {
    try {
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
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error,
      });
    }
  }

  async deleteTour(req, res) {
    try {
      await Tour.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error,
      });
    }
  }

  async getToursStats(req, res) {
    try {
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
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: ' Invalid id',
      });
    }
  }

  async getMonthlyPlan(req, res) {
    const { year } = req.params;
    console.log(year);
    try {
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
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: ' Invalid id',
      });
    }
  }
}

module.exports = new TourController();
