module.exports = function (app) {
    const { Auth } = require("../middleware/auth");
    const { SuperAdmin } = require("../middleware/superAdmin");
    const SuperAdminController = require("../controllers/SuperAdminController")
   
    app.post('/add_sub_station', [Auth, SuperAdmin], SuperAdminController.addSubStation);
    app.post('/add_fuel', [Auth, SuperAdmin], SuperAdminController.addFuel);
    app.get('/get_sub_stations', SuperAdminController.getAllSubStations);
    app.post('/update_sub_station/:id', [Auth, SuperAdmin], SuperAdminController.updateSubStation);
    app.get('/get_fuel_quota_chart_main', [Auth, SuperAdmin], SuperAdminController.getFuelChartDetails);

    app.get('/get_substation_fuel_requests',[Auth,SuperAdmin], SuperAdminController.getSubstationFuelRequests)
    app.get('/get_fuel_requests', [Auth, SuperAdmin], SuperAdminController.getFuelRequests)
    app.post("/update_substation_fuel_request_status/:requestId", [Auth, SuperAdmin], SuperAdminController.updateSubstationFuelRequestStatus);
    app.get("/get_fuel_amount",[Auth, SuperAdmin],SuperAdminController.getFuelAmount)
  };