// models/purchase.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  serial_no: String,
  date: Date,
  indent_no: String,
  purchase_order_no: String,
  vender_details: String,
  delivery_date: Date,
  payment_terms: String,
  store: String,
  item_id: String,
  items_details: String,
  hsn_code: String,
  quantity: String,
  unit: String,
  unit_price: String,
  tax_details: String,
  price_before_tax: String,
  total_price: String,
  terms_and_conditions: String,
  comments: String,
  attachments: String,
});

const PurchaseModel = mongoose.model("Purchase", purchaseSchema);

module.exports = { PurchaseModel };
