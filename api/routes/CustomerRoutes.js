module.exports = function (app) {
  const CustomerController = require("../controllers/CustomerController");
  const PaymentController = require("../controllers/PaymentController");

  app.post("/send_fuel_request", CustomerController.sendFuelRequest);
  app.get("/get_vehicle/:userId", CustomerController.getVehicle);

  app.post("/payment-sheet", PaymentController.getPaymentIntent);

  app.post("/get_latest_fuel_request", CustomerController.getLatestFuelRequest);
  app.get("/get_fuel_token/:userId/:vehicleId",CustomerController.getFuelToken)

  app.post("/complete_payment", CustomerController.completePayment)
};
