const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeFormSchema = new Schema(
  {
    serial_no: Number,
    date: Date,
    employee_id: Number,
    employee_name: String,
    address: String,
    pincode: String,
    state: String,
    country: String,
    mobile_number: String,
    email_id: String,
    department: String,
    id_proof: String,
    address_proof: String,
    photo: String,
    status: String,
  },
  {
    versionKey: "false",
  }
);

const EmployeeFormModel = mongoose.model("Employee", employeeFormSchema);

module.exports = { EmployeeFormModel };
