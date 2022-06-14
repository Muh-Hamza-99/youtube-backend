const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    updatePassword,
    forgotPassword,
} = require("../controllers/auth-controllers");

router.post("/signup", signup);
router.post("/login", login);
router.patch("/updateMyPassword", updatePassword);

router.post("/forgotPassword", forgotPassword);

module.exports = router;