const setSession = (user, done) => {
    done(null, user);
}

const verifyPermission = (user, done) => {
    return done(null, user);
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