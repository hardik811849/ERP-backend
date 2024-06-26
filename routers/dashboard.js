const express = require("express");
const { fail, success } = require("../utils/constants");
const dashboardRouter = express.Router();
const { db } = require("../db");

dashboardRouter.get("/static", (req, res) => {
  try {
    const query = `SELECT  (
      SELECT COUNT(*) FROM inquiry
    ) AS inquiryCount, (
      SELECT COUNT(*) FROM orders
    ) AS ordersCount, (
      SELECT COUNT(*) FROM store
    ) AS storeCount, (
      SELECT COUNT(*) FROM purchase
    ) AS purchaseCount, (
      SELECT COUNT(*) FROM production
    ) AS productionCount, (
      SELECT COUNT(*) FROM packaging
    ) AS packagingCount,(
        SELECT COUNT(*) FROM billing
      ) AS billingCount, (
      SELECT COUNT(*) FROM dispatch
    ) AS dipsatchCount, (
      SELECT COUNT(*) FROM replacement
    ) AS replacementCount, (
      SELECT COUNT(*) FROM employee
    ) AS employeeCount, (
      SELECT COUNT(*) FROM supplier
    ) AS supplierCount, (
      SELECT COUNT(*) FROM customer
    ) AS customerCount`;

    db.get(query, (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Static data fetched", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

module.exports = { dashboardRouter };
