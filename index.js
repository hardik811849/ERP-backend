const express = require("express");
const cors = require("cors");
const path = require("path");
const { db } = require("./db");
const jwt = require("jsonwebtoken");
const { authRouter } = require("./routers/auth");
const { superAdminRouter } = require("./routers/superAdmin");
const { inquiryRouter } = require("./routers/inquiry");
const { orderRouter } = require("./routers/order");
const { productRouter } = require("./routers/product");
const { storeRouter } = require("./routers/store");
const { purchaseRouter } = require("./routers/purchase");
const { productionRouter } = require("./routers/production");
const { packagingRouter } = require("./routers/packaging");
const { billingRouter } = require("./routers/billing");
const { dispatchRouter } = require("./routers/dispatch");
const { replacementRouter } = require("./routers/replacement");
const { adminRouter } = require("./routers/admin");
const { employeeRouter } = require("./routers/employee");
const { customerRouter } = require("./routers/customer");
const { supplierRouter } = require("./routers/supplier");
const { dashboardRouter } = require("./routers/dashboard");
const app = express();

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   const authHeader = req.headers.authorization;
//   const base = req.url.split("/");
//   if (base[1] == "auth") {
//     next();
//   } else {
//     if (!authHeader) {
//       return res.status(401).json({ message: "Token not found" });
//     }

//     jwt.verify(authHeader, process.env.SECRET_KEY, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       req.user = decoded;
//       next();
//     });
//   }
// });

app.get("/", (req, res) => {
  res.send({ message: "welcome to ERP Software Company" });
});

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/superAdmin", superAdminRouter);
app.use("/admin", adminRouter);
app.use("/employee", employeeRouter);
app.use("/customer", customerRouter);
app.use("/supplier", supplierRouter);
app.use("/inquiry", inquiryRouter);
app.use("/product", productRouter);
app.use("/orders", orderRouter);
app.use("/store", storeRouter);
app.use("/purchase", purchaseRouter);
app.use("/production", productionRouter);
app.use("/packaging", packagingRouter);
app.use("/billing", billingRouter);
app.use("/dispatch", dispatchRouter);
app.use("/replacement", replacementRouter);

app.listen(8080, async () => {
  try {
    console.log("server is running...");
  } catch (err) {
    console.error(err);
  }
});
