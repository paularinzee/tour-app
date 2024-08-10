const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
exports.deleteOne = Model => catchAsync(async (req, res, next) => {

    const tour = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({
       status: 'success',
       data: null
    });


});

exports.updateOne = Model => catchAsync(async (req, res, next) => {

    const doc= await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator:true
    });
    if (!doc) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
       status: 'success',
       data: {
           data: doc
           }
       });

});

exports.createOne = Model => catchAsync (async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
       status: 'success',
       data:{
           data: doc
           }
       });
});

exports.getOne = (Model, popOptions) => catchAsync( async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
        return next(new AppError('No tour found with that ID', 404));

    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
            }
        });
 
    
});


exports.gettAll = Model => catchAsync(async (req, res, next) => { 

    // To allow nested Get reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    
    // FILTERING
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);


    // Advanced Filtering 
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const query = doc.find(JSON.parse(queryStr));

    // // Sorting
    // if (req.query.sort) {
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     query = query.sort(sortBy);
    // } else {
    //     query = query.sort('-createdAt');
    // }
    
    // Limiting Field
    // if (req.query.fields) {
    //     const fields = red.query.fields.split(',').join(' ');
    //     query = query.select(fields);
    // } else {
    // query = query.select('-__v');
    // }
    // const tours = await Tour.find();
    // Tour.find()

    // Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page){
    //     const numTours = await Tour.countDocuments();
    //     if(skip >= numTours) throw new Error('This page does not exist');
    // }

    //pegination
    // query = query.skip(2).limit(10);
    // Execute Query
    const doc = await query.explain();

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            doc
        }
    });


});

    