module.exports = function (app) {
  const { Auth } = require("../middleware/auth");
  const { Admin } = require("../middleware/admin");

  const AdminController = require("../controllers/AdminController");

  //TODO: remove above
  app.get("/get_fuel_quota_chart_data/:subStationId", [Auth, Admin], AdminController.getFuelChartDetails);
  app.post("/add_fuel/:subStationId", [Auth, Admin], AdminController.addFuel);
  app.get("/get_vehicles/:subStaionId", [Auth, Admin], AdminController.getAllVehicles);
  app.get("/get_tokens/:searchText/:filterText", [Auth, Admin], AdminController.getAllTokens);
  app.get("/get_fuel_requests/:searchText/:filterText/:subStaionId", [Auth, Admin], AdminController.getAllFuelRequests);
  app.post("/update_token_status/:tokenId", [Auth, Admin], AdminController.updateTokenStatus);
  app.post("/customer_approval/:customerId", [Auth, Admin], AdminController.customerApproval);
  app.post("/update_fuel_request_status/:requestId", [Auth, Admin], AdminController.updateFuelRequestStatus);
  app.get("/get_all_customers", [Auth, Admin], AdminController.getAllCustomers);
  app.post("/vehicle_approval/:vehicleId", [Auth, Admin], AdminController.vehicleApproval);

  app.post("/add_token", [Auth, Admin], AdminController.addToken);
  app.post("/request_fuel_for_substation/:subStationId", [Auth, Admin], AdminController.requestFuel);
};
