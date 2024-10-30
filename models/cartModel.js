// models/cartModel.js
const connection = require("../db_connections/dbConnect");

let rentCarts = []; // In-memory storage for example purposes

const CartModel = {
  addItem: (userId, itemId, quantity, startDate, endDate) => {
    const cartItem = {
      id: rentCarts.length + 1,
      userId,
      itemId,
      quantity,
      startDate,
      endDate,
    };
    rentCarts.push(cartItem);
    return cartItem;
  },

  getItemsByUserId: (userId) => {
    return rentCarts.filter(item => item.userId === userId);
  },

  removeItem: (id) => {
    rentCarts = rentCarts.filter(item => item.id !== id);
  },
};

module.exports = CartModel;
