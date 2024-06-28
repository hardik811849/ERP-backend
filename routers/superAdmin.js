const express = require("express");
const { fail, success } = require("../utils/constants");
const superAdminRouter = express.Router();
const bcrypt = require("bcrypt");
const { SuperAdminModel } = require("../models/superAdmin.model");
require("dotenv").config();

superAdminRouter.get("/all", async (req, res) => {
  try {
    const superAdmins = await SuperAdminModel.find({});
    return success(res, "SuperAdmins fetched successfully", superAdmins);
  } catch (error) {
    return fail(res, error.message);
  }
});

superAdminRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const superAdmin = await SuperAdminModel.findById(id);
    if (!superAdmin) {
      return fail(res, "SuperAdmin not found", 404);
    }
    return success(res, "SuperAdmin fetched successfully", superAdmin);
  } catch (error) {
    return fail(res, error.message);
  }
});

superAdminRouter.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return fail(res, "All fields are required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSuperAdmin = new SuperAdminModel({
      name,
      email,
      password: hashedPassword,
    });
    await newSuperAdmin.save();
    return success(res, "SuperAdmin created successfully", newSuperAdmin);
  } catch (error) {
    return fail(res, error.message);
  }
});

superAdminRouter.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name || !email) {
      return fail(res, "All fields are required");
    }
    const updatedSuperAdmin = await SuperAdminModel.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );
    if (!updatedSuperAdmin) {
      return fail(res, "SuperAdmin not found", 404);
    }
    return success(res, "SuperAdmin updated successfully", updatedSuperAdmin);
  } catch (error) {
    return fail(res, error.message);
  }
});

superAdminRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedSuperAdmin = await SuperAdminModel.findByIdAndDelete(id);
    if (!deletedSuperAdmin) {
      return fail(res, "SuperAdmin not found", 404);
    }
    return success(res, "SuperAdmin deleted successfully", { id });
  } catch (error) {
    return fail(res, error.message);
  }
});

// superAdminRouter.post("/employee/create", async (req, res) => {
//   try {
//     const {
//       name,
//       salary,
//       leaves,
//       date_of_joining,
//       department,
//       incentive,
//       extra_benefits,
//       mobile_number,
//       password,
//     } = req.body;
//     if (
//       !name ||
//       !salary ||
//       !leaves ||
//       !date_of_joining ||
//       !department ||
//       !incentive ||
//       !extra_benefits ||
//       !mobile_number ||
//       !password
//     ) {
//       return fail(res, "All fields are required");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newEmployee = new EmployeeModel({
//       name,
//       salary,
//       leaves,
//       date_of_joining,
//       department,
//       incentive,
//       extra_benefits,
//       mobile_number,
//       password: hashedPassword,
//     });
//     await newEmployee.save();
//     return success(res, "Employee created successfully", newEmployee);
//   } catch (error) {
//     return fail(res, error.message);
//   }
// });

// superAdminRouter.post("/employee/login", async (req, res) => {
//   try {
//     const { employee_id, password } = req.body;
//     if (!employee_id || !password) {
//       return fail(res, "All fields are required");
//     }

//     const employee = await EmployeeModel.findOne({ employee_id });
//     if (!employee) {
//       return fail(res, "Invalid credentials");
//     }

//     const isPasswordValid = await bcrypt.compare(password, employee.password);
//     if (!isPasswordValid) {
//       return fail(res, "Invalid credentials");
//     }

//     const token = jwt.sign(
//       {
//         employee_id: employee.employee_id,
//         name: employee.name,
//         department: employee.department,
//       },
//       process.env.SECRET_KEY,
//       { expiresIn: "7d" }
//     );
//     return success(res, "Login successful", { token, employee });
//   } catch (error) {
//     return fail(res, error.message);
//   }
// });

module.exports = {
  superAdminRouter,
};
