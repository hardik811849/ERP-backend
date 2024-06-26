const express = require("express");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const billingRouter = express.Router();

billingRouter.post("/create", (req, res) => {
  try {
    const {
      invoice_generation,
      payment,
      expenses,
      price_prefix,
      discount_system,
      client_update,
    } = req.body;

    if (
      !invoice_generation ||
      !payment ||
      !expenses ||
      !price_prefix ||
      !discount_system ||
      !client_update
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `INSERT INTO billing (invoice_generation, payment, expenses, price_prefix, discount_system, client_update) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        invoice_generation,
        payment,
        expenses,
        price_prefix,
        discount_system,
        client_update,
      ],
      function (err) {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "Billing created");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

billingRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM billing", (err, rows) => {
      if (err) {
        return fail(res, err.message);
      }
      return success(res, "all billing fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

billingRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM billing WHERE billing_id = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Billing fetched by id", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

billingRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      invoice_generation,
      payment,
      expenses,
      price_prefix,
      discount_system,
      client_update,
    } = req.body;
    if (
      !invoice_generation ||
      !payment ||
      !expenses ||
      !price_prefix ||
      !discount_system ||
      !client_update
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `
      UPDATE billing SET invoice_generation = ?, payment = ?, expenses = ?, price_prefix = ?, discount_system = ?, client_update = ? WHERE billing_id = ?
    `,
      [
        invoice_generation,
        payment,
        expenses,
        price_prefix,
        discount_system,
        client_update,
        id,
      ],
      function (err) {
        if (err) {
          return fail(res, err.message);
        }
        return success(res, "Billing updated successfully");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

billingRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM billing WHERE billing_id = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Billing deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

module.exports = { billingRouter };
