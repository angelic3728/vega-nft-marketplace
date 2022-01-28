const express = require('express');
const router = express.Router();
const userController = require('./controllers/user.controller');
const authController = require('./controllers/auth.controller');
const authMiddle = require('./middleware/auth.middleware');
const Role = require('./utils/userRoles.utils');
const awaitHandlerFactory = require('./middleware/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema, validateLogin } = require('./middleware/validators/userValidator.middleware');

// user controller
router.get('/allusers', authMiddle(), awaitHandlerFactory(userController.getAllUsers)); // localhost:5000/allusers
router.get('/singleuser', awaitHandlerFactory(userController.getUserByAddress)); // localhost:5000/singleuser
router.get('/whoami', authMiddle(), awaitHandlerFactory(userController.getCurrentUser)); // localhost:5000/whoami
router.post('/createuser', awaitHandlerFactory(userController.createUser)); // localhost:5000/createuser
router.patch('/updateuser/:id', authMiddle(Role.Admin), updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:5000/updateuser/1 , using patch for partial update
router.delete('deleteuser/:id', authMiddle(Role.Admin), awaitHandlerFactory(userController.deleteUser)); // localhost:5000/deleteuser

router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin)); // localhost:3000/api/v1/users/login

// auth controller
router.post('/ethsign', awaitHandlerFactory(authController.createSignature)); // localhost:5000/vega/signature

module.exports = router;
