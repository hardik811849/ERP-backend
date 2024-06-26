const express = require("express");
const { fail, success } = require("../utils/constants");
const customerRouter = express.Router();
const bcrypt = require("bcrypt");
const { db } = require("../db");
require("dotenv").config();

customerRouter.post("/create", async (req, res) => {
  try {
    const {
      reference_no,
      company_name,
      address,
      address_proof,
      gst_no,
      gst_no_proof,
      mobile_number,
      email,
      alter_mobile_number,
      whatsapp_no,
      password,
    } = req.body;

    if (
      !reference_no ||
      !company_name ||
      !address ||
      !address_proof ||
      !gst_no ||
      !gst_no_proof ||
      !mobile_number ||
      !email ||
      !alter_mobile_number ||
      !whatsapp_no ||
      !password
    ) {
      return fail(res, "all the fields are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `
    INSERT INTO customer (
      reference_no,
      company_name,
      address,
      address_proof,
      gst_no,
      gst_no_proof,
      mobile_number,
      email,
      alter_mobile_number,
      whatsapp_no,
      password
    ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reference_no,
        company_name,
        address,
        address_proof,
        gst_no,
        gst_no_proof,
        mobile_number,
        email,
        alter_mobile_number,
        whatsapp_no,
        hashedPassword,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }

        db.get("SELECT last_insert_rowid() as id", (err, row) => {
          if (err) {
            return fail(res, err.message, 500);
          }
          return success(res, "customer created successfully", {
            serial_no: row.id,
            ...req.body,
          });
        });
      }
    );
  } catch (error) {
    return fail(res, error.message, 500);
  }
});

customerRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM customer", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      return success(res, "All customers", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

customerRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM customer WHERE customer_id = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      return success(res, "Customer fetched by id", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

customerRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      reference_no,
      company_name,
      address,
      address_proof,
      gst_no,
      gst_no_proof,
      mobile_number,
      email,
      alter_mobile_number,
      whatsapp_no,
      password,
    } = req.body;

    db.run(
      `UPDATE customer SET
        reference_no = ?,
        company_name = ?,
        address = ?,
        address_proof = ?,
        gst_no = ?,
        gst_no_proof = ?,
        mobile_number = ?,
        email = ?,
        alter_mobile_number = ?,
        whatsapp_no = ?,
        password = ?
        WHERE serial_no = ?`,
      [
        reference_no,
        company_name,
        address,
        address_proof,
        gst_no,
        gst_no_proof,
        mobile_number,
        email,
        alter_mobile_number,
        whatsapp_no,
        password,
        id,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        return success(res, "Customer updated");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

customerRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM customer WHERE serial_no = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Customer deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

module.exports = { customerRouter };
