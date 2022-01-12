const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("Authenication invalid");
    }

    // get token after Bearer
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, "secret-code");
        //console.log(payload);
        // attach the user to the job routes
        const user = User.findById(payload.id).select("-password");
        req.user = user;
        req.user = { userId: payload.userId, name: payload.name };
        next();
    } catch (error) {
        throw new UnauthenticatedError("Authenication invalid");
    }
};

module.exports = auth;
