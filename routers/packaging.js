const express = require("express");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const packagingRouter = express.Router();

packagingRouter.post("/create", (req, res) => {
  try {
    const { white_labeling, printing, labeling_on_box, dispatch_label } =
      req.body;

    if (!white_labeling || !printing || !labeling_on_box || !dispatch_label) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `INSERT INTO packaging (white_labeling, printing, labeling_on_box, dispatch_label) VALUES (?, ?, ?, ?)`,
      [white_labeling, printing, labeling_on_box, dispatch_label],
      function (err) {
        if (err) {
          return fail(res, err.message);
        }
        return success(res, "Packaging created successfully");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});
packagingRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM packaging", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "all packaging fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

packagingRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.get(
      "SELECT * FROM packaging WHERE packaging_id = ?",
      [id],
      (err, row) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "Packaging fetched by id", row);
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

packagingRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { white_labeling, printing, labeling_on_box, dispatch_label } =
      req.body;
    if (!white_labeling || !printing || !labeling_on_box || !dispatch_label) {
      return fail(res, "all the fields are required");
    }
    db.run(
      `UPDATE packaging SET white_labeling = ?, printing = ?, labeling_on_box = ?, dispatch_label = ? WHERE packaging_id = ?`,
      [white_labeling, printing, labeling_on_box, dispatch_label, id],
      function (err) {
        if (err) {
          return fail(res, err.message);
        }
        return success(res, "Packaging updated successfully");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});
packagingRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM packaging WHERE packaging_id = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Packaging deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});
module.exports = { packagingRouter };
