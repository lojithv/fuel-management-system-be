let express = require("express");
let router = express.Router();

router.get("/", function (req, res) {
  res.send("Welcome to transport service API!");
});

require('./AuthRoutes')(router);
require("./CustomerRoutes")(router);
require('./AdminRoutes')(router);
require('./SuperAdminRoutes')(router);

module.exports.router = router;
