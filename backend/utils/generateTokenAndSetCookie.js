const jwt = require('jsonwebtoken');

exports.generateTokenAndSetCookieAdmin = (res, adminId) => {
    const token = jwt.sign({ adminId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    const cookieName = "adminToken";
    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    return token;
};

exports.generateTokenAndSetCookieUser = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    const cookieName = "userToken";
    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    return token;
};