const express=require('express');//express
const userController = require('../controllers/userController');

const router=express.Router();// express

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports=router;