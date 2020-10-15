const db = require('./db');
const restaurants = require('./restaurants.json');


function insertRestaurant(restaurants, callback){
    //If all rstaurants have been added return and call the callback.
    if (!restaurants.length) return callback();
    const restaurant = restaurants.pop();
    //INSERT the restaurant into the DB
    db.run(`INSERT INTO restaurants(name) VALUES (?);`, [restaurant.name] , function(err){
        if (err) throw new Error(err);
        const restaurant_id = this.lastID;
        //Move onto inserting the menus for this restaurant.
        insertMenus(restaurants, restaurant, restaurant_id, callback);
    });
}

function insertMenus(restaurants, restaurant, restaurant_id, callback){
    //If all menus for the current restaurant, call insertRestaurant to add the next restaurant.
    if (!restaurant.menus.length) return insertRestaurant(restaurants, callback);
    const menu = restaurant.menus.pop();
    //INSERT the menu into the DB.
    db.run(`INSERT INTO menus(title, restaurant_id) VALUES(?, ?);`, [menu.title, restaurant_id], function(err){
        if (err) throw new Error (err);
        const menu_id = this.lastID;
        //Move onto inserting the items for the menu.
        insertItem(restaurants, restaurant, restaurant_id, menu, menu_id, callback);
    });
}
function insertItem(restaurants, restaurant, restaurant_id, menu, menu_id, callback){
    //If there are no more items to add for this current menu, call insertMenus and add the next menu.
    if (!menu.items.length) return insertMenus(restaurants, restaurant, restaurant_id, callback);
    const item = menu.items.pop();
    //Add the item to the DB.
    db.run(`INSERT INTO items(name, price, menu_id) VALUES(?, ?, ?);`, [item.name, item.price, menu_id], function(err){
        if (err) throw new Error (err);
        insertItem(restaurants, restaurant, restaurant_id, menu, menu_id, callback);
    });  
}

function loader(callback){
    insertRestaurant(restaurants, callback);
}

module.exports = loader;