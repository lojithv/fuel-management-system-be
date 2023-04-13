const UserRole = require("../enums/UserRole");

const Admin = (req, res, next) => {
  let user = req.user;

  if (user && user.userType === UserRole.ADMIN) {
     next()
  } else {
      res.status(403).json({
          success: false,
          message: "No authorization to access this route!"
      });
  }
};

module.exports = { Admin };
