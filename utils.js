const setSession = (user, done) => {
    done(null, { user_id: user.user_id, phone_number: user.phone_number, permission: user.permission });
}

const verifyPermission = (user, done) => {
    if (user.permission > 0) {
        return done(null, {
            user_id: user.user_id,
            phone_number: user.phone_number,
            permission: user.permission,
            active: true,
        });
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