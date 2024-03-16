const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importDataTour = async () => {
  try {
    await Tour.create(tours);
    console.log('import success');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteDataTour = async () => {
  try {
    await Tour.deleteMany();
    console.log('delete success');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};


if(process.argv[2]==="--import"){
  importDataTour()
}else if(process.argv[2]==="--delete"){
  deleteDataTour();
}

console.log(process.argv);
