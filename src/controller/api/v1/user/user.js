const { validationResult } = require('express-validator');
const { findOne } = require('../../../../model/user');
const User = require('../../../../model/user');

exports.addFavourite = async(req, res) => {
  try {
        // validate user input data
        const error = validationResult(req);
        if (!error.isEmpty()) {
          return res.status(422).json({
            type: 'warning',
            message: error.array()[0].msg,
          });
        }
        
        const { name, id } = req.params;

        const user = await User.findOne({_id: id});
        if (!user) {
          return res.status(404).json({
            type: 'error',
            message: 'User not found',
          });
        }

        if(user.favourite.includes(name)){
          await User.findByIdAndUpdate({_id: id}, {$pull: {favourite: name}});
        } else {
          await User.findByIdAndUpdate({_id: id}, {$addToSet: {favourite: name}});
        }

        const userData = await User.findOne({_id: id});

        res.status(200).json({
          type: 'success',
          message: 'Favourite added successfully',
          data: userData
        });

  } catch (error) {
    next(error)
  }
}

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById({_id: req.user.id});

    res.status(200).json({
      type: 'success',
      message: 'Favourite added successfully',
      data: user
    });
  } catch (err) {
    next(err)
  }
}