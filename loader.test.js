const db = require('./db');
const loader = require('./loader');
const {Restaurant} = require('./index');
// beforeAll(done => {
//     db.exec(`
//         CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT);
//         CREATE TABLE menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
//         CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT);
//     `, loader.bind(null, done))
// })

beforeAll(done => {

    db.exec(`
        CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT, imgURL TEXT);
        CREATE TABLE menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
        CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT, menu_id INTEGER);
        `, done);
    })
    

describe('DB load', () => {
    test('should load all restaurants into the DB.', (done) => {
        loader(()=>{
            db.get('SELECT COUNT(id) as total FROM restaurants', (err, row)=>{
                if (err) throw new Error(err);
                expect(row.total).toBe(8);
                done();
            });
        })
    })
    test('should load all menus into the DB.', (done) => {
        loader(()=>{
            db.get('SELECT COUNT(id) as total FROM menus', (err, row)=>{
                if (err) throw new Error(err);
                expect(row.total).toBe(18);
                done();
            });
        })
    })
    test('should load all items into the DB.', (done) => {
        loader(()=>{
            db.get('SELECT COUNT(id) as total FROM items', (err, row)=>{
                if (err) throw new Error(err);
                expect(row.total).toBe(84);
                done();
            });
        })
    })
    test('should be able to add a restautant.', async () => {
        const newRest = await new Restaurant({name: "test", imgURL: "gdfdfg"});
        expect(newRest instanceof Restaurant).toBeTruthy();
        const total = await Restaurant.findAll();
        expect(total[0] instanceof Restaurant).toBeTruthy();
        expect(total.length).toBe(9);
    })
    
})
