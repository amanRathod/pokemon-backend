const express = require('express');
const router = express.Router();
const User = require('../../../../controller/api/v1/user/user');
const authenticateUserToken = require('../../../../middleware/user');

router.get('/getUserData', authenticateUserToken, User.getUserData);
router.put('/favourite', [
], authenticateUserToken, User.addFavourite);


module.exports = router;
