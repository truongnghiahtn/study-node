const User = require('../models/userModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
class UserController {
  getAllUsers = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(User, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const allUsers = await features.query;
    res.status(200).json({
      status: 'success',
      data: {
        users: allUsers,
      },
    });
  });
  createUser(req, res, next) {
    res.status(200).json({
      status: 'success',
    });
  }

  getUser(req, res, next) {
    res.status(200).json({
      status: 'success',
    });
  }

  updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new appError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  });

  deleteMe = catchAsync(async (req, res, next) => {

    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  updateUser(req, res, next) {
    res.status(200).json({
      status: 'success',
    });
  }

  deleteUser(req, res, next) {
    res.status(200).json({
      status: 'success',
    });
  }
}
module.exports = new UserController();
