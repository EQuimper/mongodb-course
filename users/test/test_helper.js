const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/users_test');
mongoose.connection
  .once('open', () => console.log('DB Connect Good to go!'))
  .on('error', err => console.warn('Warning', err));

// Hook is execute before any other test on the test suite
beforeEach(done => {
  // Delete all the records before each test
  mongoose.connection.collections.users.drop(() => {
    // Ready to run the next test!
    done();
  });
});
