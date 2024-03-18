// đây là function giải quyết vc sử dụng try catch trong các hàm async.
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};