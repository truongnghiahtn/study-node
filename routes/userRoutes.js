const express = require('express'); //express
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router(); // express

//auth
router.route('/signup').post(authController.singUp);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

router.route('/forgotPassword').post(authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.get(
  '/getMe',
  authController.protect,
  userController.getMe,
  userController.getUser
);

//user
router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
