const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path: './config.env'});
// mongodbURL = 'mongodb://localhost/tours';
// const DB = process.env.DATABASE()

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    family: 4,
    
  })
    .then(() => {
      console.log('Connected to MongoDB');
    });
    // .catch((error) => {
    //   console.error('Error connecting to MongoDB:', error);
    // });

// const testTour = new Tour({
//     name: 'The Forest Hiker two',
//     rating: 4.7,
//     price: 497
// });
// testTour.save().then(doc =>{
//     console.log(doc);
// }).catch(err => {
//     console.log('Error', err)
// });
// console.log(process.env);
const port = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection! .. Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err=> {
  console.log('Unhandled Rejection! .. Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

