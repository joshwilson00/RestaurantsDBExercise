const {Database} = require('sqlite3');

const db = new Database(':memory:');

module.exports = db;