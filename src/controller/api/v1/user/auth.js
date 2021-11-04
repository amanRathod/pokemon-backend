const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../../model/user');

exports.register = async(req, res) => {
  try {
    // validate user input data
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        type: 'warning',
        message: error.array()[0].msg,
      });
    }

    const { email, password } = req.body;

    const emailExists = await User.findOne({email: email});
    if (emailExists){
      res.status(203).json({
        type: 'error',
        message: 'User already exists, Please try with unregister Email',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      ...req.body,
      password: hashedPassword,
      image: 'https://bucket-007.s3.ap-south-1.amazonaws.com/default.jpg',
    });

    res.status(200).json({
      type: 'success',
      message: 'User successfully created',
    });

  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};

exports.login = async(req, res, next) => {
  try {
    // validate user input data
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        type: 'warning',
        message: error.array()[0].msg,
      });
    }

    // destructure the request body
    const { email, password } = req.body;

    // verify user email
    const user = await User.findOne({email: email});
    if (!user) {
      return res.status(201).json({
        type: 'error',
        message: 'User email or passowrd is incorrect',
      });
    }

    // verify User password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(201).json({
        type: 'error',
        message: 'User email or passowrd is incorrect',
      });
    }

    // create jwt token
    const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET_KEY, {
      expiresIn: '2h',
    });

    return res.status(200).json({
      type: 'success',
      message: 'Logged-In successfully',
      token,
    });

  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: 'Server is Invalid',
    });
  }
};
