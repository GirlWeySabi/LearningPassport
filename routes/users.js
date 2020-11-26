var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const passport = require ('passport');

/* GET users listing. */
router.post('/register', userController.register);
router.get('/', userController.getAllUsers);
router.get('/user', passport.authenticate("jwt",{session:false}), userController.getOneUser);
router.post('/login', userController.login);


// console.log('it works');

module.exports = router;
