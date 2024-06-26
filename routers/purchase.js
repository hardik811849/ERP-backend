const express = require("express");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const purchaseRouter = express.Router();

purchaseRouter.post("/create", (req, res) => {
  try {
    const {
      vender_select,
      vender_guide,
      release_of_purchase_order,
      vender_receipt,
      delivery_time_date,
      payment,
      payment_mode,
      quality_check,
      quantity_check,
      return_rejected_raw_product,
    } = req.body;

    if (
      !vender_select ||
      !vender_guide ||
      !release_of_purchase_order ||
      !vender_receipt ||
      !delivery_time_date ||
      !payment ||
      !payment_mode ||
      !quality_check ||
      !quantity_check ||
      !return_rejected_raw_product
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `INSERT INTO purchase (vender_select, vender_guide, release_of_purchase_order, vender_receipt, delivery_time_date, payment, payment_mode, quality_check, quantity_check, return_rejected_raw_product) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vender_select,
        vender_guide,
        release_of_purchase_order,
        vender_receipt,
        delivery_time_date,
        payment,
        payment_mode,
        quality_check,
        quantity_check,
        return_rejected_raw_product,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "Purchase created successfully!");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

purchaseRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM purchase", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "all purchases fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

purchaseRouter.get("/:id", (req, res) => {
  try {
    let { id } = req.params;
    db.get("SELECT * FROM purchase WHERE purchase_id = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Purchase fetched by id", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

purchaseRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      vender_select,
      vender_guide,
      release_of_purchase_order,
      vender_receipt,
      delivery_time_date,
      payment,
      payment_mode,
      quality_check,
      quantity_check,
      return_rejected_raw_product,
    } = req.body;
    if (
      !vender_select ||
      !vender_guide ||
      !release_of_purchase_order ||
      !vender_receipt ||
      !delivery_time_date ||
      !payment ||
      !payment_mode ||
      !quality_check ||
      !quantity_check ||
      !return_rejected_raw_product
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `UPDATE purchase SET  vender_select = ?, vender_guide = ?, release_of_purchase_order = ?, vender_receipt = ?, delivery_time_date = ?, payment = ?, payment_mode = ?, quality_check = ?, quantity_check = ?, return_rejected_raw_product = ? WHERE purchase_id = ?`,
      [
        vender_select,
        vender_guide,
        release_of_purchase_order,
        vender_receipt,
        delivery_time_date,
        payment,
        payment_mode,
        quality_check,
        quantity_check,
        return_rejected_raw_product,
        id,
      ]
    );
    db.get("SELECT * FROM purchase WHERE purchase_id = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Purchase updated successfully!", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

purchaseRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM purchase WHERE purchase_id = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Purchase deleted successfully!");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

module.exports = {
  purchaseRouter,
};
