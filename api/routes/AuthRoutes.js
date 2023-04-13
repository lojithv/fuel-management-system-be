module.exports = function(app) {
    const { Auth } = require("../middleware/auth");

    const AuthController = require("../controllers/AuthController");

    app.post("/signup-admin", AuthController.registerAdmin);
    app.post("/signup-customer", AuthController.registerUser);
    app.post("/login", AuthController.loginUser);
    app.post("/login-customer", AuthController.loginCustomer);
    app.get("/user", Auth, AuthController.getUserDetails);

};