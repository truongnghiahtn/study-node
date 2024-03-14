class UserController {
  getAllUsers(req, res, next) {
    res.status(200).json({
      status: 'success',
    });
  }
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
