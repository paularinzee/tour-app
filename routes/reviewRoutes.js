
const express = require('express')
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');


const router = express.Router({ mergeParams: true });

//create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

router.use(authController.protect);
router
.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview

); 

router
.route('/:id')
.get(reviewController.getReview)
.patch(authController.restrictTo('user', 'admin'),reviewController.updateReview)
.delete(authController.restrictTo('user', 'admin'),reviewController.deleteReview);

module.exports = router;