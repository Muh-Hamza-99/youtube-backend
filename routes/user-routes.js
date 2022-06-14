const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    updatePassword,
    forgotPassword,
    resetPassword,
} = require("../controllers/auth-controllers");

router.post("/signup", signup);
router.post("/login", login);
router.patch("/updateMyPassword", updatePassword);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

module.exports = router;