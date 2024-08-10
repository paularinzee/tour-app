const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = [el];
    });
}
exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});



exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm){
        return next(
            new AppError(
                'This route is not for password updates.  please use /UpdateMyPassword', 400
            )
        );
    }

     const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true}); 
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    
    });
});

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet! Please use /signup instead'
    });
};

exports.getUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    });
};

exports.getMe = (req, res) => {

    req.params.id = req.uer.id;
    next();
};
exports.updateUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    });
};

// exports.deleteUser = (req, res) => {

//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not defined yet'
//     });
// };
exports.getAllUsers = factory.gettAll(User);
exports.updateUser = factory.deleteOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});