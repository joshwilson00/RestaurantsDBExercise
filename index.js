const db = require("./db");
const loader = require("./loader");

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

class Restaurant {
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM restaurants", async function (err, rows) {
        if (err) throw new Error(err);
        const restaurants = await Promise.all(
          rows.map((row) => new Restaurant(row))
        );
        resolve(restaurants);
      });
    });
  }
  constructor(data) {
    const restaurant = this;
    restaurant.id = data.id;
    restaurant.name = data.name;
    restaurant.imgURL = data.imgURL;
    restaurant.menus = [];
    if (restaurant.id) {
      return new Promise((resolve, reject) => {
        db.all(
          "SELECT * FROM menus WHERE restaurant_id IS ?",
          [restaurant.id],
          function (err, rows) {
            const menus = rows.map(async (row) => {
              return await new Menu(row);
            });
            Promise.all(menus).then((menuObj) => {
              restaurant.menus = menuObj;
              resolve(restaurant);
            });
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO restaurants(name, imgURL) VALUES(?,?)",
          [restaurant.name, restaurant.imgURL],
          function (err) {
            if (err) reject(err);
            restaurant.id = this.lastID;
            resolve(restaurant);
          }
        );
      });
    }
  }

  addMenu(...menu) {
    menu.forEach();
  }
}
class Menu {
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM menus", async function (err, rows) {
        if (err) throw new Error(err);
        const menus = await Promise.all(rows.map((row) => new Menu(row)));
        resolve(menus);
      });
    });
  }
  constructor(data) {
    const menu = this;
    menu.id = data.id;
    menu.title = data.title;
    menu.items = [];
    menu.restaurant_id = data.restaurant_id;

    if (menu.id) {
      return new Promise((resolve, reject)=>{
          db.all('SELECT * FROM items WHERE menu_id IS ?', [menu.id], async function (err, rows){
            const items = await rows.map(row =>{
                return new Item(row);
            });
            Promise.all(items).then(res =>{
                menu.items = res;
                resolve(menu);
            })
          });
      });
    }
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO menus(title, restaurant_id) VALUES (?,?);",
        [menu.title, menu.restaurant_id],
        function (err) {
          if (err) throw new Error(err);
          menu.id = this.lastID;
          resolve(menu);
        }
      );
    });
  }
}

class Item {
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM items", async function (err, rows) {
        if (err) throw new Error(err);
        const items = await Promise.all(rows.map((row) => new Item(row)));
        resolve(items);
      });
    });
  }
  constructor(data) {
    const item = this;
    item.id = data.id;
    item.name = data.name;
    item.price = data.price;

    if (item.id) {
      return Promise.resolve(item);
    }
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO items(name, menu_id) VALUES (?,?,?);",
        [item.name, item.price, item.menu_id],
        function (err) {
          if (err) throw new Error(err);
          item.id = this.lastID;
          resolve(item);
        }
      );
    });
  }
}




module.exports = { Restaurant, Menu, Item };
