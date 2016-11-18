const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  const query = Artist
    .find(buildQuery(criteria))
    .sort({ [sortProperty]: 1 }) // key interpolation
    .skip(offset)
    .limit(limit);

  return Promise.all([
    query,
    Artist.find(buildQuery(criteria)).count()
  ])
    .then(values => {
      return {
        all: values[0],
        count: values[1],
        offset,
        limit
      }
    });
};

const buildQuery = criteria => {
  const query = {};

  if (criteria.name) {
    const { name } = criteria;
    query.$text = { $search: name }
  }

  if (criteria.age) {
    const { age } = criteria;
    query.age = {
      $gte: age.min,
      $lte: age.max
    }
  }

  if (criteria.yearsActive) {
    const { yearsActive } = criteria;
    query.yearsActive = {
      $gte: yearsActive.min,
      $lte: yearsActive.max
    }
  }

  return query;
}
