const express = require("express")
const router = express.Router()

//Controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
  getAllUsers,
  forgotPassword,
  resetPassword,
} = require("../controllers/UserController");

//Middlewares
const validate = require("../middlewares/handleValidation")
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
  resetPasswordValidation,
  forgotValidation,
} = require("../middlewares/userValidation");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");


//Routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser)
router.put("/", authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"), update)
router.get("/", authGuard, getAllUsers)
router.get("/:id", getUserById)
router.post("/forgot", forgotValidation(), validate, forgotPassword);
router.post("/reset_password", resetPasswordValidation(), validate, resetPassword);

module.exports = router