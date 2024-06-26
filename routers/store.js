const express = require("express");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const storeRouter = express.Router();

storeRouter.post("/create", async (req, res) => {
  try {
    const {
      ready_products,
      allocate_stock_for_order,
      product_placed_guide,
      minimum_stock_level,
      product_id,
    } = req.body;

    if (
      !ready_products ||
      !allocate_stock_for_order ||
      !product_placed_guide ||
      !minimum_stock_level ||
      !product_id
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `INSERT INTO store (ready_products, allocate_stock_for_order, product_placed_guide, minimum_stock_level, product_id) VALUES (?, ?, ?, ?, ?)`,
      [
        ready_products,
        allocate_stock_for_order,
        product_placed_guide,
        minimum_stock_level,
        product_id,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "store created successfully!");
      }
    );
  } catch (err) {
    return fail(res, err.message);
  }
});

storeRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM store", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "all stores fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

storeRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM store WHERE store_id = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Store fetched by id", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

storeRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      ready_products,
      allocate_stock_for_order,
      product_placed_guide,
      minimum_stock_level,
      product_id,
    } = req.body;
    if (
      !ready_products ||
      !allocate_stock_for_order ||
      !product_placed_guide ||
      !minimum_stock_level ||
      !product_id
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `UPDATE store SET ready_products = ?, allocate_stock_for_order = ?, product_placed_guide = ?, minimum_stock_level = ?, product_id = ? WHERE store_id = ?`,
      [
        ready_products,
        allocate_stock_for_order,
        product_placed_guide,
        minimum_stock_level,
        product_id,
        id,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "store updated successfully!");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

storeRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run(`DELETE FROM store WHERE store_id = ?`, [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "store deleted successfully!");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});
module.exports = { storeRouter };
