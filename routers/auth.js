const express = require("express");
const bcrypt = require("bcrypt");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
// login
authRouter.post("/login", async (req, res) => {
  try {
    let { userId, password, role } = req.body;

    if (!userId || !password) {
      return fail(res, "UserId and Password are required.");
    }
    if (!role) {
      return fail(res, "Role is required.");
    }
    db.get(
      `SELECT * FROM ${role} WHERE userId = ?`,
      [userId],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }

        if (!user) {
          return fail(res, "Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return fail(res, "Invalid credentials");
        }

        const token = jwt.sign(
          { id: user.userId, name: user.name },
          process.env.SECRET_KEY,
          { expiresIn: "3h" }
        );

        success(res, "login successfully", token);
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});
// register
authRouter.post("/register", async (req, res) => {
  try {
    let { userId, name, email, password, role } = req.body;

    if (!userId || !name || !password || !email) {
      return fail(res, "UserId, Name, Email and Password are required.");
    }
    if (!role) {
      return fail(res, "Role is required.");
    }
    db.get(
      `SELECT * FROM ${role} WHERE userId = ?`,
      [userId],
      async (err, user) => {
        if (err) {
          return fail(res, err.message, 500);
        }

        if (user) {
          return fail(res, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          `INSERT INTO ${role} (userId, name, email, password) VALUES (?, ?, ?, ?)`,
          [userId, name, email, hashedPassword],
          (err) => {
            if (err) {
              return fail(res, err.message, 500);
            }
            success(res, "User registered successfully");
          }
        );
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

// / employee login
authRouter.post("/employee/login", (req, res) => {
  try {
    let { employee_id, password } = req.body;
    if (!employee_id || !password) {
      return fail(res, "all the fields are required");
    }

    db.get(
      `SELECT * FROM employee WHERE employee_id = ?`,
      [employee_id],
      async (err, user) => {
        if (err) {
          return fail(res, err.message, 500);
        }

        if (!user) {
          return fail(res, "Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return fail(res, "Invalid credentials");
        }

        const token = jwt.sign(
          {
            employee_id: user.employee_id,
            name: user.name,
            department: user.department,
          },
          process.env.SECRET_KEY,
          { expiresIn: "7d" }
        );
        success(res, "Login successful", { token, user });
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

// customer register
authRouter.post("/customer/register", async (req, res) => {
  try {
    let {
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
      `INSERT INTO customer (
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
        db.get(
          `SELECT * FROM customer WHERE mobile_number = ?`,
          [mobile_number],
          (err, row) => {
            if (err) {
              return fail(res, err.message, 500);
            }
            success(res, "Customer registered successfully", row);
          }
        );
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});
//  customer login
authRouter.post("/customer/login", async (req, res) => {
  try {
    let { serial_no, password } = req.body;

    if (!serial_no || !password) {
      return fail(res, "all the fields are required");
    }

    db.get(
      `SELECT * FROM customer WHERE serial_no = ?`,
      [serial_no],
      async (err, user) => {
        if (err) {
          return fail(res, err.message, 500);
        }

        if (!user) {
          return fail(res, "Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return fail(res, "Invalid credentials");
        }

        const token = jwt.sign(
          { id: user.serial_no, company_name: user.company_name },
          process.env.SECRET_KEY,
          {
            expiresIn: "7d",
          }
        );
        success(res, "Customer Login successfully", token);
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

// supplier register
authRouter.post("/supplier/register", async (req, res) => {
  try {
    let {
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
      `INSERT INTO supplier (
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
        db.get(
          "SELECT * FROM supplier WHERE mobile_number = ?",
          [mobile_number],
          (err, row) => {
            if (err) {
              return fail(res, err.message, 500);
            }
            success(res, "Supplier registered successfully", row);
          }
        );
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});
//  supplier login
authRouter.post("/supplier/login", async (req, res) => {
  try {
    let { serial_no, password } = req.body;

    if (!serial_no || !password) {
      return fail(res, "all the fields are required");
    }

    db.get(
      `SELECT * FROM supplier WHERE serial_no = ?`,
      [serial_no],
      async (err, user) => {
        if (err) {
          return fail(res, err.message, 500);
        }

        if (!user) {
          return fail(res, "Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return fail(res, "Invalid credentials");
        }

        const token = jwt.sign(
          { id: user.serial_no, company_name: user.company_name },
          process.env.SECRET_KEY,
          {
            expiresIn: "7d",
          }
        );
        success(res, "Supplier Login successfully", token);
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

module.exports = {
  authRouter,
};
