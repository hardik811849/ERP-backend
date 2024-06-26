const express = require("express");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const replacementRouter = express.Router();

replacementRouter.post("/create", (req, res) => {
  try {
    const {
      check_warranty,
      product_wise_replace,
      fault_analysis,
      client_wise_replacement,
      time_wise_replacement,
      client_receipt,
      amount_credit_to_client,
      check_product,
      client_update,
    } = req.body;
    if (
      !check_warranty ||
      !product_wise_replace ||
      !fault_analysis ||
      !client_wise_replacement ||
      !time_wise_replacement ||
      !client_receipt ||
      !amount_credit_to_client ||
      !check_product ||
      !client_update
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `
        INSERT INTO replacement (
          check_warranty,
          product_wise_replace,
          fault_analysis,
          client_wise_replacement,
          time_wise_replacement,
          client_receipt,
          amount_credit_to_client,
          check_product,
          client_update
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        check_warranty,
        product_wise_replace,
        fault_analysis,
        client_wise_replacement,
        time_wise_replacement,
        client_receipt,
        amount_credit_to_client,
        check_product,
        client_update,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message);
        }
        return success(res, "Replacement created successfully");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

replacementRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM replacement", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "all replacements fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

replacementRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.get(
      "SELECT * FROM replacement WHERE replacement_id = ?",
      [id],
      (err, row) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "Replacement fetched by id", row);
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

replacementRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      check_warranty,
      product_wise_replace,
      fault_analysis,
      client_wise_replacement,
      time_wise_replacement,
      client_receipt,
      amount_credit_to_client,
      check_product,
      client_update,
    } = req.body;
    if (
      !check_warranty ||
      !product_wise_replace ||
      !fault_analysis ||
      !client_wise_replacement ||
      !time_wise_replacement ||
      !client_receipt ||
      !amount_credit_to_client ||
      !check_product ||
      !client_update
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `
      UPDATE replacement SET
      check_warranty = ?,
      product_wise_replace = ?,
      fault_analysis = ?,
      client_wise_replacement = ?,
      time_wise_replacement = ?,
      client_receipt = ?,
      amount_credit_to_client = ?,
      check_product = ?,
      client_update = ?
      WHERE replacement_id = ?
    `,
      [
        check_warranty,
        product_wise_replace,
        fault_analysis,
        client_wise_replacement,
        time_wise_replacement,
        client_receipt,
        amount_credit_to_client,
        check_product,
        client_update,
        id,
      ],
      function (err) {
        if (err) {
          return fail(res, err.message);
        }
        return success(res, "Replacement updated successfully");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

replacementRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM replacement WHERE replacement_id = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Replacement deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});
module.exports = {
  replacementRouter,
};
