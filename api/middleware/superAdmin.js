const UserRole = require('../enums/UserRole');

const SuperAdmin = (req, res, next) => {
    let user = req.user;

    if (user && user.userType === UserRole.SUPER_ADMIN) {
       next()
    } else {
        res.status(403).json({
            success: false,
            message: "No authorization to access this route!"
        });
    }
};

module.exports = { SuperAdmin };