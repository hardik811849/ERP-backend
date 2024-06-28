const mongoose = require("mongoose");

// Define Mongoose schemas and models
const superAdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// const employeeSchema = new mongoose.Schema({
//   name: String,
//   salary: Number,
//   leaves: Number,
//   date_of_joining: Date,
//   department: String,
//   incentive: Number,
//   extra_benefits: String,
//   mobile_number: String,
//   password: String,
// });

const SuperAdminModel = mongoose.model("SuperAdmin", superAdminSchema);
// const EmployeeModel = mongoose.model("Employee", employeeSchema);

module.exports = { SuperAdminModel };
