const express = require("express");
const router = express.Router();

const { verifyUserToken } = require("../middlewares/verifyUserToken")
const {
    registerUser,
    loginUser,
    logoutUser,
    checkUserAuth
} = require("../controllers/userAuthController")

router.get("/checkUser-auth", verifyUserToken, checkUserAuth);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;