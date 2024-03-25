const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

const connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/natour');
    console.log('kết nối dữ liệu thành công');
  } catch (error) {
    handleError(error);
    console.log('kêt nối dữ liệu thất bại');
  }
};
connect();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importDataTour = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('import success');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteDataTour = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('delete success');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importDataTour();
} else if (process.argv[2] === '--delete') {
  deleteDataTour();
}

console.log(process.argv);
