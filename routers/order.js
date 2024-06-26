const express = require("express");
const { fail, success } = require("../utils/constants");
const orderRouter = express.Router();
const { db } = require("../db");
orderRouter.post("/create", (req, res) => {
  const {
    ordered_products,
    quality,
    total_amount,
    payment_mode,
    delivery_date,
    transport_method,
    white_labeling,
    type_of_packaging,
    urgent_requirement,
    customer_id,
  } = req.body;

  if (
    !ordered_products ||
    !quality ||
    !total_amount ||
    !payment_mode ||
    !delivery_date ||
    !transport_method ||
    !white_labeling ||
    !type_of_packaging ||
    !urgent_requirement ||
    !customer_id
  ) {
    return fail(res, "all the fields are required");
  }

  db.run(
    `INSERT INTO orders (
      ordered_products,
      quality,
      total_amount,
      payment_mode,
      delivery_date,
      transport_method,
      white_labeling,
      type_of_packaging,
      urgent_requirement,
      customer_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ordered_products,
      quality,
      total_amount,
      payment_mode,
      delivery_date,
      transport_method,
      white_labeling,
      type_of_packaging,
      urgent_requirement,
      customer_id,
    ],
    (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Order created successfully!");
    }
  );
});

orderRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM orders", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "all orders fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

orderRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM orders WHERE order_id = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Order fetched by id", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

orderRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      ordered_products,
      quality,
      total_amount,
      payment_mode,
      delivery_date,
      transport_method,
      white_labeling,
      type_of_packaging,
      urgent_requirement,
      customer_id,
    } = req.body;
    if (
      !ordered_products ||
      !quality ||
      !total_amount ||
      !payment_mode ||
      !delivery_date ||
      !transport_method ||
      !white_labeling ||
      !type_of_packaging ||
      !urgent_requirement ||
      !customer_id
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `UPDATE orders SET
        ordered_products = ?,
        quality = ?,
        total_amount = ?,
        payment_mode = ?,
        delivery_date = ?,
        transport_method = ?,
        white_labeling = ?,
        type_of_packaging = ?,
        urgent_requirement = ?,
        customer_id = ?
      WHERE order_id = ?`,
      [
        ordered_products,
        quality,
        total_amount,
        payment_mode,
        delivery_date,
        transport_method,
        white_labeling,
        type_of_packaging,
        urgent_requirement,
        customer_id,
      ]
    );
    db.get("SELECT * FROM orders WHERE order_id = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Order updated", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

orderRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM orders WHERE order_id = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Order deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

module.exports = { orderRouter };
