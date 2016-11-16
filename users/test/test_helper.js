const mongoose = require('mongoose');

// Make mongoose use ES6 Promise
mongoose.Promise = global.Promise;

// only one time before the test run
before(done => {
  mongoose.connect('mongodb://localhost/users_test');
  mongoose.connection
    .once('open', () => done())
    .on('error', err => console.warn('Warning', err));
});

// Hook is execute before any other test on the test suite
beforeEach(done => {
  // Delete all the records before each test
  mongoose.connection.collections.users.drop(() => {
    // Ready to run the next test!
    done();
  });
});
