const express = require("express");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const inquiryRouter = express.Router();

// create inquiry
inquiryRouter.post("/create", (req, res) => {
  const {
    customer_name,
    address,
    contact_no,
    inquiry_of_products,
    quality,
    medium_of_inquiry,
    assign_to,
    status,
  } = req.body;
  if (
    !customer_name ||
    !address ||
    !contact_no ||
    !inquiry_of_products ||
    !quality ||
    !medium_of_inquiry ||
    !assign_to ||
    !status
  ) {
    return fail(res, "all the fields are required");
  }

  db.run(
    `INSERT INTO inquiry (customer_name, address, contact_no, inquiry_of_products, quality, medium_of_inquiry, assign_to, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      customer_name,
      address,
      contact_no,
      inquiry_of_products,
      quality,
      medium_of_inquiry,
      assign_to,
      status,
    ],
    (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Inquiry created successfully!");
    }
  );
});

// get all inquiry
inquiryRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM inquiry", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "all inquiry fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
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
inquiryRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_name,
      address,
      contact_no,
      inquiry_of_products,
      quality,
      medium_of_inquiry,
      assign_to,
      status,
    } = req.body;
    if (
      !customer_name ||
      !address ||
      !contact_no ||
      !inquiry_of_products ||
      !quality ||
      !medium_of_inquiry ||
      !assign_to ||
      !status
    ) {
      return fail(res, "all the fields are required");
    }
    db.run(
      `UPDATE inquiry SET customer_name = ?, address = ?, contact_no = ?, inquiry_of_products = ?, quality = ?, medium_of_inquiry = ?, assign_to = ?, status = ? WHERE inquiry_id = ?`,
      [
        customer_name,
        address,
        contact_no,
        inquiry_of_products,
        +quality,
        medium_of_inquiry,
        assign_to,
        status,
        id,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "Inquiry updated successfully!");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

// delete inquiry
inquiryRouter.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM inquiry WHERE inquiry_id = ?`, [id], (err) => {
    if (err) {
      return fail(res, err.message, 500);
    }
    success(res, "Inquiry deleted successfully!");
  });
});

module.exports = {
  inquiryRouter,
};
