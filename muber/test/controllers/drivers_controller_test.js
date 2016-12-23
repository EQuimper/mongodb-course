const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
  // ===============================
  //          POST ~ Routes
  // ===============================
  it('POST to /api/drivers creates a new driver', done => {
    Driver.count().then(count => {
      request(app)
        .post('/api/drivers')
        .send({
          email: 'test@test.com'
        })
        .end((err, res) => {
          Driver.count().then(newCount => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });
  // ===============================
  //          PUT ~ Routes
  // ===============================
  it('PUT to /api/drivers/id edit an existing driver', done => {
    const driver = new Driver({ email: 't@t.com' });

    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end(() => {
          Driver.findOne({ email: 't@t.com' })
            .then(driver => {
              assert(driver.driving === true);
              done();
            });
        });
    });
  });
  // ===============================
  //          DELETE ~ Routes
  // ===============================
  it('DELETE to /api/drivers/id delete a driver', done => {
    const driver = new Driver({ email: 'test@test.com' });

    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: 'test@test.com' })
            .then(driver => {
              assert(!driver);
              done();
            });
        });
    });
  });
  // ===============================
  //          GET ~ Routes
  // ===============================
  it('GET to /api/drivers finds drivers in a location', done => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: { coordinates: [-122.4759902, 47.6147628] }
    });

    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: { coordinates: [-80.253, 25.791] }
    });

    Promise.all([ seattleDriver.save(), miamiDriver.save() ])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, res) => {
            assert(res.body.length === 1);
            assert(res.body[0].obj.email === 'miami@test.com');
            done();
          });
      });
  });
});