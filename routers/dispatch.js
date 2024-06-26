const express = require("express");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const dispatchRouter = express.Router();

dispatchRouter.post("/create", (req, res) => {
  try {
    const {
      dispatch_discussion,
      transport_copy,
      transport_option_wise,
      client_update,
    } = req.body;

    if (
      !dispatch_discussion ||
      !transport_copy ||
      !transport_option_wise ||
      !client_update
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `
      INSERT INTO dispatch (dispatch_discussion, transport_copy, transport_option_wise, client_update) VALUES (?, ?, ?, ?)
      `,
      [
        dispatch_discussion,
        transport_copy,
        transport_option_wise,
        client_update,
      ],
      function (err) {
        if (err) {
          return fail(res, err.message);
        }
        return success(res, "Disptach created successfully");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

dispatchRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM dispatch", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "all dispatch fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

dispatchRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      dispatch_discussion,
      transport_copy,
      transport_option_wise,
      client_update,
    } = req.body;
    if (
      !dispatch_discussion ||
      !transport_copy ||
      !transport_option_wise ||
      !client_update
    ) {
      return fail(res, "all the fields are required");
    }
    db.run(
      `UPDATE dispatch SET dispatch_discussion = ?, transport_copy = ?, transport_option_wise = ?, client_update = ? WHERE dispatch_id = ?`,
      [
        dispatch_discussion,
        transport_copy,
        transport_option_wise,
        client_update,
        id,
      ],
      function (err) {
        if (err) {
          return fail(res, err.message);
        }
        return success(res, "Dispatch updated successfully");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

dispatchRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM dispatch WHERE dispatch_id = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Dispatch deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});
module.exports = { dispatchRouter };
