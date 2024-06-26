const express = require("express");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const productRouter = express.Router();

productRouter.post("/create", async (req, res) => {
  try {
    const {
      sku,
      product_code,
      description,
      type_of_product,
      walt,
      cct,
      body_color,
      reflector_color,
      glass_color,
      product_photo,
      size,
    } = req.body;

    if (
      !sku ||
      !product_code ||
      !description ||
      !type_of_product ||
      !walt ||
      !cct ||
      !body_color ||
      !reflector_color ||
      !glass_color ||
      !product_photo ||
      !size
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `INSERT INTO product (sku, product_code, description, type_of_product, walt, cct, body_color, reflector_color, glass_color, product_photo, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`[
        (sku,
        product_code,
        description,
        type_of_product,
        walt,
        cct,
        body_color,
        reflector_color,
        glass_color,
        product_photo,
        size)
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "Product created successfully!");
      }
    );
  } catch (err) {
    return fail(res, err.message);
  }
});

productRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM product", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "all products fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

productRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM product WHERE product_id = ?", [id], (err, row) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Product fetched by id", row);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

productRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      sku,
      product_code,
      description,
      type_of_product,
      walt,
      cct,
      body_color,
      reflector_color,
      glass_color,
      product_photo,
      size,
    } = req.body;
    if (
      !sku ||
      !product_code ||
      !description ||
      !type_of_product ||
      !walt ||
      !cct ||
      !body_color ||
      !reflector_color ||
      !glass_color ||
      !product_photo ||
      !size
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `
        UPDATE product
        SET sku = ?,
            product_code = ?,
            description = ?,
            type_of_product = ?,
            walt = ?,
            cct = ?,
            body_color = ?,
            reflector_color = ?,
            glass_color = ?,
            product_photo = ?,
            size = ?
        WHERE product_id = ?`,
      [
        sku,
        product_code,
        description,
        type_of_product,
        walt,
        cct,
        body_color,
        reflector_color,
        glass_color,
        product_photo,
        size,
      ]
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

productRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM product WHERE product_id = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Product deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

module.exports = { productRouter };
