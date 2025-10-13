const express = require("express");
const router = express.Router();

const { verifyAdminToken } = require("../middlewares/verifyAdminToken")
const {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    checkAdminAuth,
} = require("../controllers/adminAuthController")

router.get("/check-auth", verifyAdminToken, checkAdminAuth);

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;
