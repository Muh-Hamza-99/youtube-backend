const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    updatePassword,
    forgotPassword,
    resetPassword,
} = require("../controllers/auth-controllers");

const {
    subscribe,
    unSubscribe
} = require("../controllers/user-controllers");

const protect = require("../middleware/protect");

router.post("/signup", signup);
router.post("/login", login);
router.patch("/updateMyPassword", updatePassword);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);

router.patch("/subscribe", subscribe);
router.patch("/unsubscribe", unSubscribe);

module.exports = router;