const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquirySchema = new Schema(
  {
    serial_no: Number,
    date: Date,
    inquiry_no: String,
    client_name: String,
    client_details: String,
    payment_terms: String,
    validity_of_inquiry: String,
    delivery_time: String,
    inquiry_date: String,
    item_id: String,
    product: String,
    item_description: String,
    hsn_code: String,
    quantity: Number,
    unit: Number,
    unit_price: Number,
    discount: Number,
    tax: Number,
    total_price: Number,
    total_price_with_tax: Number,
    comments: String,
  },
  {
    versionKey: "false",
  }
);

const InquiryModel = mongoose.model("Inquiry", inquirySchema);

module.exports = { InquiryModel };
