// File: apps/server/src/utils/pagination.js
const mongoose = require("mongoose");
const Product = require("../models/Product");

async function fetchPaginatedProducts(query, sortObj, limit, cursor) {
  if (cursor) {
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  const products = await Product.find(query)
    .populate("category", "name")
    .sort(sortObj)
    .limit(Number(limit) + 1);

  let nextCursor = null;
  if (products.length > limit) {
    nextCursor = products[limit - 1]._id;
    products.pop();
  }

  return { products, nextCursor };
}
``;

module.exports = { fetchPaginatedProducts };
