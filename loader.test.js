const db = require('./db');
const loader = require('./loader');

// beforeAll(done => {
//     db.exec(`
//         CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT);
//         CREATE TABLE menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
//         CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT);
//     `, loader.bind(null, done))
// })

beforeAll(done => {

    db.exec(`
        CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT);
        CREATE TABLE menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
        CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT, menu_id INTEGER);
        `, done);
    })
    

describe('DB load', () => {
    test('should load all restaurants into the DB.', (done) => {
        loader(()=>{
            db.get('SELECT COUNT(id) as total FROM restaurants', (err, row)=>{
                if (err) throw new Error(err);
                expect(row.total).toBe(10);
                done();
            });
        })
    })
    
})
