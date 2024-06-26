const express = require("express");
const { fail, success } = require("../utils/constants");
const adminRouter = express.Router();
const bcrypt = require("bcrypt");
const { db } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

adminRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM admin", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Admin fetched successfully", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

adminRouter.post("/create", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return fail(res, "all the fields are required");
    }
    const hashed = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO admin (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashed],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        db.get("SELECT * FROM admin WHERE email = ?", [email], (err, user) => {
          if (err) {
            return fail(res, err.message, 500);
          }
          return success(res, "Admin created successfully", user);
        });
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

adminRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name || !email) {
      return fail(res, "all the fields are required");
    }
    // const hashed = bcrypt.hash(password, 10);
    db.run(
      `UPDATE admin SET name = ?, email = ? WHERE userId = ?`,
      [name, email, id],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        return success(res, "Admin updated successfully");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

adminRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM admin WHERE userId = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Admin deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

// employee login
adminRouter.post("/employee/login", (req, res) => {
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

// employee register
adminRouter.post("/employee/create", async (req, res) => {
  try {
    const {
      name,
      salary,
      leaves,
      date_of_joining,
      department,
      incentive,
      extra_benefits,
      mobile_number,
      password,
    } = req.body;
    if (
      !name ||
      !salary ||
      !leaves ||
      !date_of_joining ||
      !department ||
      !incentive ||
      !extra_benefits ||
      !mobile_number ||
      !password
    ) {
      return fail(res, "all the fields are required");
    }

    const hashed = await bcrypt.hash(password, 10);
    db.run(
      `
        INSERT INTO employee (name, salary, leaves, date_of_joining, department, incentive, extra_benefits, mobile_number, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        salary,
        leaves,
        date_of_joining,
        department,
        incentive,
        extra_benefits,
        mobile_number,
        hashed,
      ],

      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        db.get(
          "SELECT * FROM employee WHERE name = ? AND department = ?",
          [name, department],
          (err, row) => {
            if (err) {
              return fail(res, err.message, 500);
            }
            success(res, "Employee created successfully", row);
          }
        );
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

// get all employees
adminRouter.get("/employee/all", (req, res) => {
  try {
    db.all("SELECT * FROM employee", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      return success(res, "All employees", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

// employee update
adminRouter.patch("/employee/update/:id", (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      salary,
      leaves,
      date_of_joining,
      department,
      incentive,
      extra_benefits,
      mobile_number,
    } = req.body;
    db.run(
      `UPDATE employee SET name = ?, salary = ?, leaves = ?, date_of_joining = ?, department = ?, incentive = ?, extra_benefits = ?, mobile_number = ? WHERE id = ?`,
      [
        name,
        salary,
        leaves,
        date_of_joining,
        department,
        incentive,
        extra_benefits,
        mobile_number,
        id,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        db.get(`SELECT * FROM employee WHERE id = ?`, [id], (err, row) => {
          if (err) {
            return fail(res, err.message, 500);
          }
          success(res, "Employee updated successfully", row);
        });
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

// employee delete
adminRouter.delete("/employee/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM employee WHERE id = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Employee deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

// customer create
adminRouter.post("/customer/create", (req, res) => {
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
      !whatsapp_no
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `
    INSERT INTO customer (reference_no, company_name, address, address_proof, gst_no, gst_no_proof, mobile_number, email, alter_mobile_number, whatsapp_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
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
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        return success(res, "Customer created successfully");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});
module.exports = { adminRouter };
