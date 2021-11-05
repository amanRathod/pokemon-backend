const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../../../../controller/api/v1/user/user');
const authenticateUserToken = require('../../../../middleware/user');


router.put('/favourite/:name/:id', [
  body('name').not().isEmpty().withMessage('Name is required'),
], User.addFavourite);
router.get('/', authenticateUserToken, User.getUserData);


module.exports = router;
