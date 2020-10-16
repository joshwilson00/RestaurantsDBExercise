const db = require('./db');
const loader = require('./loader');


// const beforeAll = ()=>{
//     console.log('About to create the tables!');
//     return new Promise((resolve, reject) =>{
//         db.exec(`
//         CREATE TABLE IF NOT EXISTS restaurants(id INTEGER PRIMARY KEY, name TEXT);
//         CREATE TABLE IF NOT EXISTS menus(id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);
//         CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT, menu_id INTEGER);
//         `, resolve());
//     });
// }

// beforeAll();

const JStoDB = ()=>{
    return new Promise((resolve, reject)=>{
        loader(()=>{
            db.get('SELECT COUNT(id) as total FROM restaurants', (err, row)=>{
                if (err) throw new Error(err);
                resolve();
            });
        })   
    })
}


class Restaurant {
    static findAll(){
        return new Promise((resolve, reject) =>{
            db.all('SELECT * FROM restaurants', async function(err, rows){
                if (err) throw new Error(err);
                const restaurants = await Promise.all(rows.map(row => new Restaurant(row)));
                resolve(restaurants);
            })
        });
    }
    constructor(data){
        const restaurant = this;
        restaurant.id = data.id;
        restaurant.name = data.name;
        restaurant.imgURL = data.imgURL;
        if (restaurant.id) {return Promise.resolve(restaurant)};
        return new Promise((resolve, reject) =>{
            db.run('INSERT INTO restaurants(name, imgURL) VALUES(?,?)', [restaurant.name, restaurant.imgURL], function(err){
                if(err) reject(err);
                restaurant.id = this.lastID;
                console.log(`Added to restaurant with ID: ${restaurant.id}`);
                resolve(restaurant);
            })
        })
    }    
}

class Menu {
    static findAll(){
        return new Promise((resolve, reject) =>{
            db.all('SELECT * FROM menus', async function(err, rows){
                if (err) throw new Error(err);
                const menus = await Promise.all(rows.map(row => new Menu(row)));
                resolve(menus);
            })
        });
    }
    constructor(data){
        const menu = this;
        menu.id = data.id;
        menu.title = data.title;
        menu.restaurant_id = data.restaurant_id;

        if (menu.id) {return Promise.resolve(menu)};
        return new Promise((resolve, reject) =>{
            db.run('INSERT INTO menus(title, restaurant_id) VALUES (?,?);', [menu.title, menu.restaurant_id], function (err){
                if (err) throw new Error(err);
                menu.id = this.lastID;
                console.log(`Menu added with ID: ${menu.id}`);
                resolve(menu);
            });
        })
    }
}

class Item {
    static findAll(){
        return new Promise((resolve, reject) =>{
            db.all('SELECT * FROM items', async function(err, rows){
                if (err) throw new Error(err);
                const items = await Promise.all(rows.map(row => new Item(row)));
                resolve(items);
            })
        });
    }
    constructor(data){
        const item = this;
        item.id = data.id;
        item.name = data.name;
        item.price = data.price;
        item.menu_id = data.menu_id;

        if (item.id) {return Promise.resolve(item)};
        return new Promise((resolve, reject) =>{
            db.run('INSERT INTO items(name, menu_id) VALUES (?,?,?);', [item.name, item.price, item.menu_id], function (err){
                if (err) throw new Error(err);
                item.id = this.lastID;
                console.log(`Item added with ID: ${item.id}`);
                resolve(item);
            });
        })
    }
}
module.exports = {Restaurant, Menu, Item};


