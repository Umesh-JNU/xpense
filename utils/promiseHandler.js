const { db } = require('../config/database');

module.exports = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    })
  })
}