const express = require("express");
const router = express.Router();

//Controller
const {
  insertList,
  deleteList,
  getAllLists,
  getUserLists,
  getListById,
  updateList,
  insertProduct,
  getProductByListId,
} = require("../controllers/ListController");


//Middlewares
const {
  listCreateValidation,
  listUpdateValidation,
} = require("../middlewares/listValidation");
const{productCreateValidation} = require("../middlewares/productValidation")
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation")

//Routes
router.post("/", authGuard, listCreateValidation(), validate, insertList)
router.delete("/:id", authGuard, deleteList)
router.get("/", authGuard, getAllLists)
router.get("/user/:id", authGuard, getUserLists)
router.get("/:id", authGuard, getListById);
router.put("/:id", authGuard, listUpdateValidation(), validate, updateList)

module.exports = router