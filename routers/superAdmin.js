const express = require("express");
const { fail, success } = require("../utils/constants");
const superAdminRouter = express.Router();
const bcrypt = require("bcrypt");
const { db } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

superAdminRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM superAdmin", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      return success(res, "superAdmin fetched successfully", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

superAdminRouter.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    db.all(`SELECT * FROM superAdmin WHERE id = ?`, [id], (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      return success(res, "superAdmin fetched successfully", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

superAdminRouter.post("/create", (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return fail(res, "all the fields are required");
    }
    const hashed = bcrypt.hashSync(password, 10);
    db.run(
      `INSERT INTO superAdmin (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashed],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        db.get(
          "SELECT * FROM superAdmin WHERE email = ?",
          [email],
          (err, row) => {
            if (err) {
              return fail(res, err.message, 500);
            }
            return success(res, "SuperAdmin created successfully", row);
          }
        );
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

superAdminRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name || !email) {
      return fail(res, "all the fields are required");
    }
    // const hashed = bcrypt.hash(password, 10);
    db.run(
      `UPDATE superAdmin SET name = ?, email = ? WHERE userId = ?`,
      [name, email, id],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        return success(res, "superAdmin updated successfully", {
          userId: id,
          name,
          email,
        });
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

superAdminRouter.delete("/delete/:id", (req, res) => {
  try {
    const id = req.params.id;
    db.run(`DELETE FROM superAdmin WHERE userId = ?`, [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      return success(res, "superAdmin deleted successfully", { id });
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

// employee register
superAdminRouter.post("/employee/create", async (req, res) => {
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

// employee login
superAdminRouter.post("/employee/login", (req, res) => {
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

module.exports = {
  superAdminRouter,
};
