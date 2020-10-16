const db = require('./db');
const loader = require('./loader');
const {Restaurant, Menu, Item} = require('./index');
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
    test('should be able to get all the menus.', async () => {
        let total = await Menu.findAll();
        expect(total.length).toBe(18);
        const newMenu = await new Menu({title: "TestMenu", restaurant_id: 3});
        total = await Menu.findAll();
        expect(total.length).toBe(19);
        expect(total[12] instanceof Menu).toBeTruthy();
        expect(total[1].title).toBe('Lunch Menu');
    });

    test('should be able to get all items', async () => {
        let total = await Item.findAll();
        expect(total.length).toBe(84);
        expect(total[30] instanceof Item).toBeTruthy();
    })
    test('Restaurant should have menus.', async() => {
        const restaurants = await Restaurant.findAll();
        const menus = restaurants[2].menus;
        expect(menus.length).toBe(4);
    })
    test('Menus should have items.', async () => {
        const menu = await Menu.findAll();
        const items = menu[0].items;
        expect(items.length).toBe(3);
    })
    test('Restaurant should have menus that should have items and the item should have a price.', async () => {
        const restaurants = await Restaurant.findAll();
        // console.log(JSON.stringify(restaurants, '', 2));
        console.log(restaurants[0].menus[0]);
    })
    
    
})
