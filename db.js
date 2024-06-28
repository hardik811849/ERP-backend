const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://hardikgfuturetech:hardik@cluster0.wwilh0m.mongodb.net/ERP-Database?retryWrites=true&w=majority&appName=Cluster0"
);

module.exports = { connection };
