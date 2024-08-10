const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const app = express();

//Set security HTTP headers
app.use(helmet());
// limit request from same API
const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// middleware

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss()); 
//Serving static files
app.use(express.static(`${__dirname}/public`));


//

// app.get('/api/v1/tours', getAllTours );


// app.get('/api/v1/tours/:id',getTour );


// app.post('/api/v1/tours', addTour );

// app.patch('/api/v1/tours/:id', updateTour );

// app.delete('/api/v1/tours/:id', deleteTour);



// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server`, 404));

});

app.use(globalErrorHandler);
module.exports = app;  