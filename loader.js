const db = require('./db');
const restaurants = require('./restaurants.json');


function insertRestaurant(restaurants, callback){
    if (!restaurants.length) return callback();
    const restaurant = restaurants.pop();
    db.run(`INSERT INTO restaurants(name) VALUES (?);`, [restaurant.name] , function(err){
        if (err) throw new Error(err);
        const restaurant_id = this.lastID;
        console.log(`Restautant added with ID: ${restaurant_id}`);
        insertMenus(restaurant, restaurant_id);
        insertRestaurant(restaurants, callback);
    });
}

function insertMenus(restaurant, restaurant_id){
    console.log('Inserting menu for this restaurant: ', restaurant);
    if (!restaurant.menus.length) return;
    const menu = restaurant.menus.pop();
    db.run(`INSERT INTO menus(title, restaurant_id) VALUES(?, ?);`, [menu.title, restaurant_id], function(err){
        if (err) throw new Error (err);
        const menu_id = this.lastID;
        insertItem(menu, menu_id);
        insertMenus(restaurant, restaurant_id);
    });
}
function insertItem(menu, menu_id){
    console.log('Inserting item for this menu: ', menu);
    if (!menu.items.length) return;
    const item = menu.items.pop();
    db.run(`INSERT INTO items(name, price, menu_id) VALUES(?, ?, ?);`, [item.name, item.price, menu_id], function(err){
        if (err) throw new Error (err);
        insertItem(menu, menu_id);
    });  
}

function loader(callback){
    insertRestaurant(restaurants, callback);
}

module.exports = loader;