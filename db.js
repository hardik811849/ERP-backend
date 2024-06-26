const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite3 database.");
  }
});

// models
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS superAdmin (
      userId INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      password TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      userId INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      password TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS customer (
      serial_no INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      customer_id INTEGER,
      company_name TEXT,
      billing_address TEXT,
      billing_pincode INTEGER CHECK(LENGTH(billing_pincode) = 6),
      billing_state TEXT,
      billing_country TEXT,
      dispatch_address TEXT,
      dispatch_pincode INTEGER CHECK(LENGTH(dispatch_pincode) = 6),
      dispatch_state TEXT,
      dispatch_country TEXT,
      contact_person TEXT,
      mobile_number TEXT CHECK(LENGTH(mobile_number) = 10),
      email TEXT,
      whatsapp_no TEXT,
      gst_no TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS supplier (
      serial_no INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_no INTEGER,
      company_name TEXT,
      address TEXT,
      address_proof TEXT,
      gst_no TEXT,
      gst_no_proof TEXT,
      mobile_number TEXT,
      email TEXT,
      alter_mobile_number TEXT,
      whatsapp_no TEXT,
      password TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS employee (
      serial_no INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      employee_id INTEGER,
      name TEXT,
      address TEXT,
      pincode INTEGER CHECK(LENGTH(pincode) = 6),
      state TEXT,
      country TEXT,
      mobile_number TEXT CHECK(LENGTH(mobile_number) = 10),
      email TEXT,
      department TEXT,
      id_proof TEXT,
      address_proof TEXT,
      photo TEXT,
      status TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS product (
      serial_no INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT,
      product_code TEXT,
      product_description TEXT,
      type_of_product TEXT,
      watt TEXT,
      cct TEXT,
      body_color TEXT,
      reflector_color TEXT,
      glass_color TEXT,
      product_photo TEXT,
      size TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS inquiry (
      inquiry_id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      address TEXT,
      contact_no TEXT,
      inquiry_of_products TEXT,
      quality INTEGER,
      medium_of_inquiry TEXT,
      assign_to TEXT,
      status TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id INTEGER PRIMARY KEY AUTOINCREMENT,
      ordered_products TEXT,
      quality INTEGER,
      total_amount TEXT,
      payment_mode TEXT,
      delivery_date TEXT,
      transport_method TEXT,
      white_labeling TEXT,
      type_of_packaging TEXT,
      urgent_requirement TEXT,
      customer_id INTEGER,
      FOREIGN KEY (customer_id) REFERENCES customer(serial_no)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS store (
      store_id INTEGER PRIMARY KEY AUTOINCREMENT,
      ready_products TEXT,
      allocate_stock_for_order TEXT,
      product_placed_guide TEXT,
      minimum_stock_level TEXT,
      product_id INTEGER,
      FOREIGN KEY (product_id) REFERENCES product(serial_no)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS purchase (
      serial_no INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      indent_no INTEGER,
      purchase_order_no INTEGER,
      vendor_details TEXT,
      delivery_date TEXT,
      payment_terms TEXT,
      store TEXT,
      item_id INTEGER,
      item_details TEXT,
      hsn_code INTEGER,
      quantity INTEGER,
      unit INTEGER,
      unit_price INTEGER,
      tax_details TEXT,
      price_before_tax INTEGER,
      total_price INTEGER,
      terms_and_conditions TEXT,
      comment TEXT,
      attachments TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS production (
      date TEXT,
      sales_order_no INTEGER,
      delivery_time TEXT,
      production_order_no INTEGER,
      item_id INTEGER,
      product TEXT,
      item_description TEXT,
      quantity INTEGER,
      unit INTEGER,
      finished_quantity INTEGER,
      pending_quantity INTEGER,
      status TEXT,
      brand TEXT,
      printing TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS packaging (
      packaging_id INTEGER PRIMARY KEY AUTOINCREMENT,
      white_labeling TEXT,
      printing TEXT,
      labeling_on_box TEXT,
      dispatch_label TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS billing (
      billing_id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_generation TEXT,
      payment TEXT,
      expenses TEXT,
      price_prefix TEXT,
      discount_system TEXT,
      client_update BOOLEAN
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS dispatch (
      dispatch_id INTEGER PRIMARY KEY AUTOINCREMENT,
      dispatch_discussion TEXT,
      transport_copy TEXT,
      transport_option_wise TEXT,
      client_update BOOLEAN
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS replacement (
      replacement_id INTEGER PRIMARY KEY AUTOINCREMENT,
      check_warranty TEXT,
      product_wise_replace TEXT,
      fault_analysis TEXT,
      client_wise_replacement TEXT,
      time_wise_replacement TEXT,
      client_receipt TEXT,
      amount_credit_to_client TEXT,
      check_product TEXT,
      client_update BOOLEAN
    )
  `);
});

module.exports = {
  db,
};
