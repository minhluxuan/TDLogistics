const { object } = require("joi");

const setSession = (user, done) => {
  
    done(null, user);
}

const verifyPermission = (user, done) => {
    if (user.permission > 0) {
        user.active=true;
        return done(null, user);
    }
    done(null, false);
}

const isAuthenticated = (permission) => {
    return (req, res, next) => {
        if (!req.isAuthenticated() || req.user.permission !== permission) {
            return res.status(403).json({
                error: true,
                message: "Bạn không được phép truy cập tài nguyên này."
            });
        }

        next();
    }
}

module.exports = {
    setSession,
    verifyPermission,
    isAuthenticated,
}