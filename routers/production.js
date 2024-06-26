const express = require("express");
const { fail, success } = require("../utils/constants");
const { db } = require("../db");
const productionRouter = express.Router();

productionRouter.post("/create", (req, res) => {
  try {
    const {
      raw_product,
      production_process,
      quality_check,
      final_check,
      client_access_to_production,
      scraped,
    } = req.body;

    if (
      !raw_product ||
      !production_process ||
      !quality_check ||
      !final_check ||
      !client_access_to_production ||
      !scraped
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `
   INSERT INTO production (raw_product, production_process, quality_check, final_check, client_access_to_production, scraped) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        raw_product,
        production_process,
        quality_check,
        final_check,
        client_access_to_production,
        scraped,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "Production created successfully!");
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

productionRouter.get("/all", (req, res) => {
  try {
    db.all("SELECT * FROM production", (err, rows) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "all productions fetched", rows);
    });
  } catch (error) {
    return fail(res, error.message);
  }
});

productionRouter.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.get(
      `SELECT * FROM production WHERE production_id = ?`,
      [id],
      (err, row) => {
        if (err) {
          return fail(res, err.message, 500);
        }
        success(res, "Production fetched by id", row);
      }
    );
  } catch (error) {
    return fail(res, error.message);
  }
});

productionRouter.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      raw_product,
      production_process,
      quality_check,
      final_check,
      client_access_to_production,
      scraped,
    } = req.body;
    if (
      !raw_product ||
      !production_process ||
      !quality_check ||
      !final_check ||
      !client_access_to_production ||
      !scraped
    ) {
      return fail(res, "all the fields are required");
    }

    db.run(
      `UPDATE production SET raw_product = ?, production_process = ?, quality_check = ?, final_check = ?, client_access_to_production = ?, scraped = ? WHERE production_id = ?`,
      [
        raw_product,
        production_process,
        quality_check,
        final_check,
        client_access_to_production,
        scraped,
        id,
      ],
      (err) => {
        if (err) {
          return fail(res, err.message, 500);
        }
      }
    );

    success(res, "Production updated successfully!");
  } catch (error) {
    return fail(res, error.message);
  }
});

productionRouter.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.run("DELETE FROM production WHERE production_id = ?", [id], (err) => {
      if (err) {
        return fail(res, err.message, 500);
      }
      success(res, "Production deleted");
    });
  } catch (error) {
    return fail(res, error.message);
  }
});
module.exports = { productionRouter };
