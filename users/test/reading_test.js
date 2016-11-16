const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {
  let joe;
  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    joe.save()
      .then(() => done());
  });
  it('finds all users with a name of joe', done => {
    User.find({ name: 'Joe' })
      .then(users => {
        // Need to use toString cause this is objectId
        // And cannot do === with that
        assert(users[0]._id.toString() === joe._id.toString());
        done();
      })
      .catch(err => console.log(err))
  });
});
