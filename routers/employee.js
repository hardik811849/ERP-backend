const express = require("express");
const { fail, success } = require("../utils/constants");
const employeeRouter = express.Router();
const bcrypt = require("bcrypt");
const { EmployeeFormModel } = require("../models/employe.model"); // Corrected import
const jwt = require("jsonwebtoken");
require("dotenv").config();

// employee login

// employee register
employeeRouter.post("/create", async (req, res) => {
  try {
    const {
      serial_no,
      date,
      employee_id,
      employee_name,
      address,
      pincode,
      state,
      country,
      mobile_number,
      email_id,
      department,
      id_proof,
      address_proof,
      photo,
      status,
    } = req.body;

    const newEmployee = new EmployeeFormModel({
      serial_no,
      date,
      employee_id,
      employee_name,
      address,
      pincode,
      state,
      country,
      mobile_number,
      email_id,
      department,
      id_proof,
      address_proof,
      photo,
      status,
    });
    await newEmployee.save();

    success(res, "Employee created successfully!", newEmployee);
  } catch (err) {
    fail(res, err.message, 500);
  }
});

// get all employees
employeeRouter.get("/all", async (req, res) => {
  try {
    const employees = await EmployeeFormModel.find({});
    success(res, "All employees", employees);
  } catch (err) {
    fail(res, err.message, 500);
  }
});

// employee update
employeeRouter.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {
      serial_no,
      date,
      employee_id,
      employee_name,
      address,
      pincode,
      state,
      country,
      mobile_number,
      email_id,
      department,
      id_proof,
      address_proof,
      photo,
      status,
    } = req.body;

    // Validate if all required fields are provided
    if (
      !serial_no ||
      !date ||
      !employee_id ||
      !employee_name ||
      !address ||
      !pincode ||
      !state ||
      !country ||
      !mobile_number ||
      !email_id ||
      !department ||
      !id_proof ||
      !address_proof ||
      !photo ||
      !status
    ) {
      return fail(res, "All fields are required", 400);
    }

    const updatedEmployee = await EmployeeFormModel.findByIdAndUpdate(
      id,
      {
        serial_no,
        date,
        employee_id,
        employee_name,
        address,
        pincode,
        state,
        country,
        mobile_number,
        email_id,
        department,
        id_proof,
        address_proof,
        photo,
        status,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return fail(res, "Employee not found", 404);
    }

    success(res, "Employee updated successfully", updatedEmployee);
  } catch (err) {
    fail(res, err.message, 500);
  }
});

// employee delete
employeeRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await EmployeeFormModel.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return fail(res, "Employee not found", 404);
    }

    success(res, "Employee deleted successfully");
  } catch (err) {
    fail(res, err.message, 500);
  }
});

module.exports = {
  employeeRouter,
};
