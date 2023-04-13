const sendMail = require("../services/mail");
const contactUsMail = require("../services/contactUsMail");
const { v4: uuidv4 } = require("uuid");
const { CustomerFuelRequest } = require("../models/CustomerFuelRequestModel");
const statusType = require("../enums/FuelTokenStatusType");
const { Vehicle } = require("../models/VehicleModel");
const { Token } = require("../models/TokenModel");
const FuelTokenStatusType = require("../enums/FuelTokenStatusType");
const FuelRequestStatusType = require("../enums/FuelRequestStatusType");

exports.getFuelToken = async (req, res) => {
  const userId = String(req.params.userId);
  const vehicleId = String(req.params.vehicleId);
  console.log(userId, " ",vehicleId)
  try {
    Token.findOne({
      user_id: userId,
      vehicle_id: vehicleId,
    }).then((token) => {
      if (!token) {
        return res.status(422).json({
          success: false,
          message: "Fuel token not available!",
          data: token,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Fuel token received!",
        data: token,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//TODO: Send fuel requests
exports.sendFuelRequest = async (req, res) => {
  console.log(req.body.customerId, req.body.vehicleId, req.body);
  try {
    Token.findOne({
      user_id: req.body.customerId,
      vehicle_id: req.body.vehicleId,
    }).then((token) => {
      console.log(token);
      if (token && (token.status === statusType.NEW || token.status === statusType.ISSUED)) {
        let newFuelRequest = new CustomerFuelRequest(req.body);
        console.log("new fuel request adding", req.body);
        try {
          Token.findOneAndUpdate(
            {
              user_id: req.body.customerId,
              vehicle_id: req.body.vehicleId,
            },
            { status: FuelTokenStatusType.PENDING },
            { new: true }
          ).then((updated)=>{
            console.log(updated)
            newFuelRequest.save((err, fuelRequest) => {
              if (err) {
                console.log(err);
                return res.status(422).json({
                  success: false,
                  message: "Unable to add fuel request!",
                  data: err,
                });
              } else {
                try {
                } catch (error) {
                  console.error(error);
                  return res.status(422).json({
                    success: false,
                    message: "Unable to add fuel request!",
                    data: err,
                  });
                }
    
                return res.status(200).json({
                  success: true,
                  message: "New Fuel request is added!",
                  data: fuelRequest,
                });
              }
            });
          });
        } catch (error) {
          return res.status(422).json({
            success: false,
            message: "Unable to update fuel token!",
            data: err,
          });
        }

      } else {
        return res.status(422).json({
          success: false,
          message: "Unable to add fuel request!",
          data: token,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLatestFuelRequest = async (req, res) => {
  try {
    Token.findOne({
      user_id: req.body.userId,
      vehicle_id: req.body.vehicleId,
    }).then((token) => {
      if (token) {
        try {
          CustomerFuelRequest.findOne(
            { customerId: req.body.userId, vehicleId: req.body.vehicleId },
            {},
            { sort: { createdDate: -1 } }
          ).then((request) => {
            if (request?.status !== statusType.ISSUED) {
              return res.status(200).json({
                success: true,
                message: "Received request!",
                data: request,
              });
            } else {
              return res.status(400).json({
                success: true,
                message: "Received latest request!",
                data: request,
              });
            }
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      } else {
        res
          .status(500)
          .json({ success: false, message: "Fuel token not available" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVehicle = async (req, res) => {
  const userId = String(req.params.userId);
  console.log("userId", userId);

  try {
    await Vehicle.findOne({ user_id: userId }, (error, vehicle) => {
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "vehicle not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "vehicle found!",
        data: vehicle,
      });
    });
  } catch (error) {
    console.log("error");
  }
};

exports.completePayment = async (req, res) => {
  try {
    Token.findOneAndUpdate(
      { _id: req.body.tokenId },
      { $set: { status: FuelTokenStatusType.PAID } },
      { new: true,populate:['user_id'] },

      function (err, token) {
        if (err) {
          return res.status(422).json({
            success: false,
            message: "Error occured while processing the request",
          });
        }

        if (!token) {
          return res.status(422).json({
            success: false,
            message: "Invalid token id!",
          });
        }

        CustomerFuelRequest.findOneAndUpdate(
          { customerId: token.user_id, vehicleId: token.vehicle_id },
          { $set: { status: FuelRequestStatusType.PAID } },
          { new: true, sort: { createdDate: -1 } },
          (err, reqUpdate) => {
            if (err) {
              return res.status(422).json({
                success: false,
                message: `Unable to update request!`,
                data: err,
              });
            }
          }
        );
        sendMail(token.user_id.email,{description:"Fuel Request Token",note:"Fuel Token: "+token.token, subject:"Test Subject", text:"Test Text"})
        return res.status(200).json({
          success: true,
          message: "Status updated!!",
          data: token,
        });
      }
    );
  } catch (error) {
    console.log("error");
  }
};
