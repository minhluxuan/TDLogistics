class Auth {
    setSession = (user, done) => {
        done(null, user);
    }
    
    verifyPermission = (user, done) => {
        return done(null, user);
    }

    isAuthenticated = () => {
        return (req, res, next) => {
            if (!req.isAuthenticated()) {
                return res.status(403).json({
                    error: true,
                    message: "Người dùng không được phép truy cập tài nguyên này."
                });
            }
    
            next();
        }
    }

    isAuthorized = (roles) => {
        return (req, res, next) => {
            for (const role of roles) {
                if (req.user.role === role) {
                    return next();
                }
            }
    
            return res.status(403).json({
                error: true,
                message: "Người dùng không được phép truy cập tài nguyên này.",
            });
        }
    }

    isActivated = () => {
        return (req, res, next) => {
            return req.user.active ? next() : res.status(403).json({
                error: true,
                message: "Tài khoản chưa được kích hoạt. Vui lòng thay đổi mật khẩu.",
            });
        }
    }
}

module.exports = new Auth();