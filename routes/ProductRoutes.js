const express = require("express");
const router = express.Router();

//Controller
const { insertProduct, deleteProduct, updateProduct, getProductByListId } = require("../controllers/ProductController");


//Middlewares
const { productUpdateValidation, productCreateValidation } = require("../middlewares/productValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation")

//Routes
router.post("/", authGuard, productCreateValidation(), validate, insertProduct)
router.delete("/:id", authGuard, deleteProduct);
router.get("/:id", authGuard, getProductByListId);
router.put("/:id", authGuard, productUpdateValidation(), validate, updateProduct);


module.exports = router