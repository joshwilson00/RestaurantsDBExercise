const db = require('./db');
const loader = require('./loader');


const beforeAll = ()=>{
    return new Promise((resolve, reject) =>{
        db.exec(`
        CREATE TABLE restaurants(id INTEGER PRIMARY KEY, name TEXT);
        CREATE TABLE menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
        CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT, menu_id INTEGER);
        `, resolve());
    });
}

beforeAll();

loader(()=>{
    db.get('SELECT COUNT(id) as total FROM restaurants', (err, row)=>{
        if (err) throw new Error(err);
        console.log(row.total);
    });
})