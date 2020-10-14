const {Database} = require('sqlite3');

const db = new Database('./test.db');

module.exports = db;