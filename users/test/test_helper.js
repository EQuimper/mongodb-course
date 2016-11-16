const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/users_test');
mongoose.connection
  .once('open', () => console.log('DB Connect Good to go!'))
  .on('error', err => console.warn('Warning', err));
