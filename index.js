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
        console.log(restaurant);
        if (restaurant.id) {return Promise.resolve(restaurant)};
        return new Promise((resolve, reject) =>{
            db.run('INSERT INTO restaurants(name, imgURL) VALUES(?,?)', [restaurant.name, restaurant.imgURL], function(err){
                if(err) reject(err);
                restaurant.id = this.lastID;
                console.log(`Added to DB with ID: ${restaurant.id}`);
                resolve(restaurant);
            })
        })
    }    
}

module.exports = {Restaurant};


