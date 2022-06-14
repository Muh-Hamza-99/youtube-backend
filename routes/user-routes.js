const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    updatePassword
} = require("../controllers/auth-controllers");

router.post("/signup", signup);
router.post("/login", login);
router.patch("/updateMyPassword", updatePassword);

module.exports = router;