const db = require('./db');
const restaurants = require('./restaurants.json');


function insertRestaurant(restaurants, callback){
    if (!restaurants.length) return callback();
    const restaurant = restaurants.pop();
    db.run(`INSERT INTO restaurants(name) VALUES (?);`, [restaurant.name] , function(err){
        if (err) throw new Error(err);
        const restaurant_id = this.lastID;
        console.log(`Restautant added with ID: ${restaurant_id}`);
        insertMenus(restaurants, restaurant, restaurant_id, callback);
    });
}

function insertMenus(restaurants, restaurant, restaurant_id, callback){
    console.log('Inserting menu for this restaurant: ', restaurant);
    if (!restaurant.menus.length) return insertRestaurant(restaurants, callback);
    const menu = restaurant.menus.pop();
    db.run(`INSERT INTO menus(title, restaurant_id) VALUES(?, ?);`, [menu.title, restaurant_id], function(err){
        if (err) throw new Error (err);
        const menu_id = this.lastID;
        insertItem(restaurants, restaurant, restaurant_id, menu, menu_id, callback);
    });
}
function insertItem(restaurants, restaurant, restaurant_id, menu, menu_id, callback){
    console.log('Inserting item for this menu: ', menu);
    if (!menu.items.length) return insertMenus(restaurants, restaurant, restaurant_id, callback);
    const item = menu.items.pop();
    db.run(`INSERT INTO items(name, price, menu_id) VALUES(?, ?, ?);`, [item.name, item.price, menu_id], function(err){
        if (err) throw new Error (err);
        insertItem(restaurants, restaurant, restaurant_id, menu, menu_id, callback);
    });  
}

function loader(callback){
    insertRestaurant(restaurants, callback);
}

module.exports = loader;