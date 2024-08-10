
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';  
    req.query.sort = '-ratingsAverage,price';
    req,query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter () {
        
    }
}

exports.getAllTours = factory.gettAll(Tour);

// exports.getAllTours = catchAsync(async (req, res, next) => { 
    
//         // FILTERING
//         const queryObj = { ...req.query }
//         const excludedFields = ['page', 'sort', 'limit', 'fields'];
//         excludedFields.forEach(el => delete queryObj[el]);


//         // Advanced Filtering 
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//         const query = Tour.find(JSON.parse(queryStr));

//         // // Sorting
//         // if (req.query.sort) {
//         //     const sortBy = req.query.sort.split(',').join(' ');
//         //     query = query.sort(sortBy);
//         // } else {
//         //     query = query.sort('-createdAt');
//         // }
        
//         // Limiting Field
//         // if (req.query.fields) {
//         //     const fields = red.query.fields.split(',').join(' ');
//         //     query = query.select(fields);
//         // } else {
//         // query = query.select('-__v');
//         // }
//         // const tours = await Tour.find();
//         // Tour.find()

//         // Pagination
//         // const page = req.query.page * 1 || 1;
//         // const limit = req.query.limit * 1 || 100;
//         // const skip = (page - 1) * limit;

//         // query = query.skip(skip).limit(limit);

//         // if (req.query.page){
//         //     const numTours = await Tour.countDocuments();
//         //     if(skip >= numTours) throw new Error('This page does not exist');
//         // }

//         //pegination
//         // query = query.skip(2).limit(10);
//         // Execute Query
//         const tours = await query;

//         res.status(200).json({
//             status: 'success',
//             results: tours.length,
//             data: {
//                 tours
//             }
//         });

  
// });

exports.getTour = catchAsync(async (req, res, next) => {
 
        const tour = await Tour.findById(req.params.id).populate('reviews');

        if (!tour) {
            return next(new AppError('No tour found with that ID', 404));
        }

        res.status(200).json({
        status: 'success',
        // results: tours.length,
        data:{
            tour  
        }
    }); 
    
    
});

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.getTour = catchAsync(async (req, res, next) => {
 
    //     const tour = await Tour.findById(req.params.id).populate('reviews');

    //     if (!tour) {
    //         return next(new AppError('No tour found with that ID', 404));
    //     }

    //     res.status(200).json({
    //     status: 'success',
    //     // results: tours.length,
    //     data:{
    //         tour  
    //     }
    // }); 
    
    
});


exports.createTour = factory.createOne(Tour);
    //    exports.createTour = catchAsync (async (req, res, next) => {
    //     const newTour= await Tour.create(req.body);
    //     res.status(201).json({
    //        status: 'success',
    //        data:{
    //            tour: newTour
    //            }
    //        });
    
    // try {
       

    // } catch (err){
    //     res.status(400).json({
    //         status: 'fail',
    //         message: 'Invalid'
    //     });
    // }
   
// });

exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {

//         const tour= await Tour.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidator:true
//         });
//         if (!tour) {
//             return next(new AppError('No tour found with that ID', 404));
//         }

//         res.status(201).json({
//            status: 'success',
//            data:{
//                tour
//                }
//            });

// });

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {

//         const tour = await Tour.findByIdAndDelete(req.params.id);
//         if (!tour) {
//             return next(new AppError('No tour found with that ID', 404));
//         }
//         res.status(204).json({
//            status: 'success',
//            data: null
//         });

   
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
 
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 }}
                
            },
            {
                $group: {
                    _id: { $toUpper:'$difficulty'},
                    numTours: { $sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgPrice: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    avgPrice: {$min: '$price'},
                    avgPrice: {$max: '$price'},

                }

            },
            {
                $sort: {avgPrice: 1}
            },
            // {
            //     $match: {_id: { $ne: 'EASY'}}
            // }

        ]);
      res.status(201).json({
        status: 'success',
        data:{
            stats
            }
        });  
    
});

exports.getMonthlyPlan = catchAsync( async (req, res, next) => {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name'}
                }
            },
            {
                $addFields: { month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {numTourStarts: -1}
            },
            {
                $limit: 12
            }
        ]);
 
        res.status(200).json({
            status: 'success',
            data:{
                plan
                }
            });  
    
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng.',
                400
            )
        );
    }
    const tours = await Tour.find({ startLocation: { $geoWihin: { $centerSphere: [[lng, lat], radius]} } });
    res.status(200).json({
        status: 'success',
        results: tours.lenght,
        data: {
            data:tours
        }
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng.',
                400
            )
        );
    }
   const distances = await Tour.aggregate([
    {
        $geoNear: {
            near: {
                type: 'Point',
                coordinates: [lng * 1, lat * 1]
            },
            distancefield: 'distance',
            distanceMultiplier: multiplier
        }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    
   ]);
    
    res.status(200).json({
        status: 'success',
        data: {
            data:distances
        }
    });
});