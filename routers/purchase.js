const express = require("express");
const { fail, success } = require("../utils/constants");
const { PurchaseModel } = require("../models/purchase.model");
const purchaseRouter = express.Router();

// Create a purchase
purchaseRouter.post("/create", async (req, res) => {
  try {
    const newPurchase = new PurchaseModel(req.body);

    await newPurchase.save();

    success(res, "Purchase created successfully!", newPurchase);
  } catch (error) {
    fail(res, error.message);
  }
});

// Get all purchases
purchaseRouter.get("/", async (req, res) => {
  try {
    const allPurchases = await PurchaseModel.find();
    success(res, "All purchases fetched", allPurchases);
  } catch (error) {
    fail(res, error.message);
  }
});

// Get a purchase by ID
purchaseRouter.get("/:id", async (req, res) => {
  try {
    const purchase = await PurchaseModel.findById(req.params.id);
    if (!purchase) {
      return fail(res, "Purchase not found", 404);
    }
    success(res, "Purchase fetched by id", purchase);
  } catch (error) {
    fail(res, error.message);
  }
});

// Update a purchase by ID
purchaseRouter.patch("/update/:id", async (req, res) => {
  try {
    const updatedPurchase = await PurchaseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPurchase) {
      return fail(res, "Purchase not found", 404);
    }
    success(res, "Purchase updated successfully!", updatedPurchase);
  } catch (error) {
    fail(res, error.message);
  }
});

// Delete a purchase by ID
purchaseRouter.delete("/delete/:id", async (req, res) => {
  try {
    const deletedPurchase = await PurchaseModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedPurchase) {
      return fail(res, "Purchase not found", 404);
    }
    success(res, "Purchase deleted successfully!");
  } catch (error) {
    fail(res, error.message);
  }
});

module.exports = {
  purchaseRouter,
};
