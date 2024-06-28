const express = require("express");
const { fail, success } = require("../utils/constants");
const { InquiryModel } = require("../models/inquiry.model");
const inquiryRouter = express.Router();

// create inquiry
inquiryRouter.post("/create", async (req, res) => {
  const {
    serial_no,
    date,
    inquiry_no,
    client_name,
    client_details,
    payment_terms,
    validity_of_inquiry,
    delivery_time,
    inquiry_date,
    item_id,
    product,
    item_description,
    hsn_code,
    quantity,
    unit,
    unit_price,
    discount,
    tax,
    total_price,
    total_price_with_tax,
    comments,
  } = req.body;

  try {
    const newInquiry = new InquiryModel({
      serial_no,
      date,
      inquiry_no,
      client_name,
      client_details,
      payment_terms,
      validity_of_inquiry,
      delivery_time,
      inquiry_date,
      item_id,
      product,
      item_description,
      hsn_code,
      quantity,
      unit,
      unit_price,
      discount,
      tax,
      total_price,
      total_price_with_tax,
      comments,
    });
    await newInquiry.save();
    // console.log("Inquiry created successfully");
    success(res, "Inquiry created successfully!");
  } catch (err) {
    console.error("Error inserting inquiry:", err);
    fail(res, err.message, 500);
  }
});

inquiryRouter.get("/", async (req, res) => {
  try {
    const inquiries = await InquiryModel.find({});
    success(res, "All inquiries fetched", inquiries);
  } catch (err) {
    fail(res, err.message, 500);
  }
});

// get inquiry by id
inquiryRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM inquiry WHERE inquiry_id = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Inquiry fetched by id", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});
// update inquiry
inquiryRouter.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serial_no,
      date,
      inquiry_no,
      client_name,
      client_details,
      payment_terms,
      validity_of_inquiry,
      delivery_time,
      inquiry_date,
      item_id,
      product,
      item_description,
      hsn_code,
      quantity,
      unit,
      unit_price,
      discount,
      tax,
      total_price,
      total_price_with_tax,
      comments,
    } = req.body;

    const updatedInquiry = await InquiryModel.findOneAndUpdate(
      { _id: id },
      {
        serial_no,
        date,
        inquiry_no,
        client_name,
        client_details,
        payment_terms,
        validity_of_inquiry,
        delivery_time,
        inquiry_date,
        item_id,
        product,
        item_description,
        hsn_code,
        quantity,
        unit,
        unit_price,
        discount,
        tax,
        total_price,
        total_price_with_tax,
        comments,
      },
      { new: true }
    );

    if (!updatedInquiry) {
      return fail(res, "Inquiry not found", 404);
    }

    success(res, "Inquiry updated successfully", updatedInquiry);
  } catch (err) {
    fail(res, err.message, 500);
  }
});

// delete inquiry
inquiryRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInquiry = await InquiryModel.findByIdAndDelete({ _id: id });

    if (!deletedInquiry) {
      return fail(res, "Inquiry not found", 404);
    }

    success(res, "Inquiry deleted successfully");
  } catch (err) {
    fail(res, err.message, 500);
  }
});

module.exports = {
  inquiryRouter,
};
