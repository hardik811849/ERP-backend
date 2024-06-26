const express = require("express");
const { fail, success } = require("../utils/constants");
const supplierRouter = express.Router();
const bcrypt = require("bcrypt");
const { db } = require("../db");
require("dotenv").config();

supplierRouter.post("/create", async (req, res) => {
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
    INSERT INTO supplier (
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
          return success(res, "supplier created successfully", {
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

supplierRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM supplier", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      return success(res, "All suppliers", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

supplierRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM supplier WHERE serial_no = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      return success(res, "supplier fetched by id", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

supplierRouter.patch("/update/:id", (req, res) => {
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
      `UPDATE supplier SET
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
        return success(res, "supplier updated");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

supplierRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM supplier WHERE serial_no = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "supplier deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

module.exports = { supplierRouter };
