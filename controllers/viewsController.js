const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
class ViewsController {
  getBase(req, res) {
    res.status(200).render('base');
  }

  getOverview = catchAsync(async (req, res) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
      title: 'All Tours',
      tours,
    });
  });

  getTour = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user',
    });

    if (!tour) {
      return next(new AppError('There is no tour with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
  });
  getLoginForm = (req, res) => {
    res.status(200).render('login', {
      title: 'Log into your account',
    });
  };
  getAccount = (req, res) => {
    res.status(200).render('account', {
      title: 'Your account',
    });
  };
  updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email
      },
      {
        new: true,
        runValidators: true
      }
    );
  
    res.status(200).render('account', {
      title: 'Your account',
      user: updatedUser
    });
  });
}

module.exports = new ViewsController();
