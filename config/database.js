const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/natour');
    console.log("kết nối dữ liệu thành công");
  } catch (error) {
    handleError(error);
    console.log("kêt nối dữ liệu thất bại");
  }
};
module.exports= connect;
