// const { Booking } = require("../models/BookingModel");
// const { Place } = require("../models/PlaceModel");
// const { TripPricing } = require("../models/TripPricingModel");
// const { Package } = require("../models/PackageModel");
const sendMail = require("../services/mail");
const mongoose = require("mongoose");
const { SubStation } = require("../models/SubStationModel");
const { Token } = require("../models/TokenModel");
const { CustomerFuelRequest } = require("../models/CustomerFuelRequestModel");
const { Vehicle } = require("../models/VehicleModel");
const { User } = require("../models/UserModel");
const UserRole = require("../enums/UserRole");
const {
  FuelRequestMainStation,
} = require("../models/MainStationFuelRequestModel");
const { DateHelper } = require("../helpers/date");
const { TokenHelper } = require("../helpers/token");
const fuelRequestStatusType = require("../enums/FuelRequestStatusType");
const fuelTokenStatusType = require("../enums/FuelTokenStatusType");
const FuelType = require("../enums/FuelType");

//TODO: GET FUEL QUOTA FOR CHART
//TODO: ADD FUEL

//TODO: GET ALL CUSTOMERS
//TODO: GET ALL TOKENS
//TODO: GET ALL FUEL REQUESTS

//TODO: UPDATE TOKEN STATUS ("APPROVE", "REJECT","ISSUED")
//TODO: CUSOTOMER APPROVAL ("ACCEPT", "REJECT")
//TODO: UPDATE FUEL REQUEST STATUS ("ACCEPT", "REJECT")

//TODO: GET FUEL QUOTA FOR CHART
exports.getFuelChartDetails = async (req, res) => {
  const subStationId = req.params.subStationId;
  try {
    let issuedDieselAmount = 0;
    let issuedPetrolAmount = 0;
    let customerIssuedDieselAmount = 0;
    let customerIssuedPetrolAmount = 0;
    let customerPendingDieselAmount = 0;
    let customerPendingPetrolAmount = 0;

    if (!subStationId) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }


    const subStation = await SubStation.find({
      $and: [{ _id: subStationId }],
    });

    if (subStation.length > 0) {
      if (subStation[0].dieselAmount) {
        issuedDieselAmount += subStation[0].dieselAmount;
      } else {
        issuedDieselAmount += 0;
      }

      if (subStation[0].petrolAmount) {
        issuedPetrolAmount += subStation[0].petrolAmount;
      } else {
        issuedPetrolAmount += 0;
      }
    }

    const customerFuelRequests = await CustomerFuelRequest.find({
      $and: [{ subStationId: subStationId }],
    }).populate({
      path: "vehicleId",
      select: "",
    });

    if (customerFuelRequests.length > 0) {
      customerFuelRequests.forEach((cusRequest) => {
        if (cusRequest.status == fuelRequestStatusType.APPROVED) {
          if (cusRequest.vehicleId.fuelType == FuelType.PETROL) {
            customerPendingPetrolAmount += cusRequest.requestedFuelAmount;
          } else if (cusRequest.vehicleId.fuelType == FuelType.DIESEL) {
            customerPendingDieselAmount += cusRequest.requestedFuelAmount;
          }
        } else if (cusRequest.status == fuelRequestStatusType.ISSUED) {
          if (cusRequest.vehicleId.fuelType == FuelType.PETROL) {
            customerIssuedPetrolAmount += cusRequest.requestedFuelAmount;
          } else if (cusRequest.vehicleId.fuelType == FuelType.DIESEL) {
            customerIssuedDieselAmount += cusRequest.requestedFuelAmount;
          }
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Received sub chart!",
      data: {
        issuedFuelAmount: {
          issuedDieselAmount: issuedDieselAmount,
          issuedPetrolAmount: issuedPetrolAmount,
        },
        customerFuelReq: {
          customerIssuedDieselAmount: customerIssuedDieselAmount,
          customerIssuedPetrolAmount: customerIssuedPetrolAmount,
          customerPendingDieselAmount: customerPendingDieselAmount,
          customerPendingPetrolAmount: customerPendingPetrolAmount,
        }
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addFuel = async (req, res) => {
  const { dieselAmount } = req.body;
  const { petrolAmount } = req.body;
  // if (!minAmount) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Request min amount",
  //   });
  // }
  try {
    const subStation = await SubStation.findById(req.params.subStationId);
    if (!subStation) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }
    if (dieselAmount) {
      subStation.dieselAmount = dieselAmount;
    }
    if (petrolAmount) {
      subStation.petrolAmount = petrolAmount;
    }
    await subStation.save((err, place) => {
      if (err) {
        return res.status(422).json({
          success: false,
          message: "Unable to add!",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Updated!",
          data: place,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.requestFuel = async (req, res) => {
  const { dieselAmount } = req.body;
  const { petrolAmount } = req.body;
  const subStationId = req.params.subStationId;

  console.log("request fuel");
  // if (!minAmount) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Request min amount",
  //   });
  // }
  try {
    const fuelRequest = new FuelRequestMainStation({
      dieselAmount,
      petrolAmount,
      subStationId,
    });

    await fuelRequest.save((err, place) => {
      if (err) {
        return res.status(422).json({
          success: false,
          message: "Unable to add!",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Updated!",
          data: place,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllVehicles = async (req, res) => {
  console.log("getAllVehicles");
  const filterText = String(req.params.filterText);
  const searchText = String(req.params.searchText);
  const subStaionId = String(req.params.subStaionId);
  //aggretion funct
  try {
    if (filterText == "null" && searchText == "null") {
      const vehicles = await Vehicle.find().populate({
        path: "user_id",
        select: "",
      });
      return res.status(200).json({
        success: true,
        message: "Received vehicles!",
        data: vehicles,
      });
    }
    if (subStaionId) {
      const vehicles = await Vehicle.find({
        $and: [{ stationId: subStaionId }],
      }).populate({ path: "user_id", select: "" });
      return res.status(200).json({
        success: true,
        message: "Received vehicles!",
        data: vehicles,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  //aggretion funct
  try {
    const vehicles = await User.find({ userType: UserRole.CUSTOMER });
    return res.status(200).json({
      success: true,
      message: "Received customers!",
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllTokens = async (req, res) => {
  const filterText = String(req.params.filterText);
  const searchText = String(req.params.searchText);
  console.log("filterText", filterText);
  console.log("searchText", searchText);

  //aggretion funct
  try {
    if (filterText == "null" && searchText == "null") {
      console.log("test");
      const tokens = await Token.find({});
      return res.status(200).json({
        success: true,
        message: "Received tokens!",
        data: tokens,
      });
    } else if (filterText || searchText) {
      const tokens = await Token.find({
        $or: [],
      });
      return res.status(200).json({
        success: true,
        message: "Received tokens!",
        data: tokens,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllFuelRequests = async (req, res) => {
  const filterText = String(req.params.filterText);
  const searchText = String(req.params.searchText);
  const subStaionId = String(req.params.subStaionId);
  //aggretion funct
  try {
    if (filterText == "" && searchText == "") {
      console.log("test");
      const requests = await CustomerFuelRequest.find().populate({
        path: "customerId",
        select: "",
      });
      return res.status(200).json({
        success: true,
        message: "Received requests!",
        data: requests,
      });
    }
    if (subStaionId) {
      const requests = await CustomerFuelRequest.find({
        $and: [{ subStationId: subStaionId }],
      }).populate([
        {
          path: "customerId",
          select: "",
        },
        {
          path: "vehicleId",
          select: "",
        },
      ]);
      return res.status(200).json({
        success: true,
        message: "Received requests!",
        data: requests,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTokenStatus = (req, res) => {
  Token.findOneAndUpdate(
    { _id: req.params.tokenId },
    { $set: req.body },
    { new: true,populate:["user_id","vehicle_id"]},

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
        { customerId: token.user_id._id, vehicleId: token.vehicle_id._id },
        { $set: req.body },
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
      return res.status(200).json({
        success: true,
        message: "Status updated!!",
        data: token,
      });
    }
  );
};

exports.vehicleApproval = (req, res) => {
  console.log("req.params.customerId", req.params);
  console.log("body", req.body);

  Vehicle.findOneAndUpdate(
    { _id: req.params.vehicleId },
    { $set: req.body },
    { new: true, populate: "user_id" },

    function (err, vehicle) {
      if (err) {
        return res.status(422).json({
          success: false,
          message: "Error occured while processing the request",
        });
      }

      if (!vehicle) {
        return res.status(422).json({
          success: false,
          message: "Invalid vehicle id!",
        });
      } else {
        if (vehicle.status === fuelRequestStatusType.APPROVED) {
          const date = new Date();
          const token = new Token({
            user_id: vehicle.user_id._id,
            vehicle_id: vehicle._id,
            token: TokenHelper.generateToken(
              vehicle.user_id.username,
              vehicle.vehicleNumber
            ),
            fuelType: vehicle.fuelType,
            fuelLimit: 10000,
            expireDate: DateHelper.addWeeksToDate(date, 1),
          });
          token.save((err, token) => {
            if (err) {
              console.log(err);
            } else {
              console.log(token);
            }
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: "Status updated!!",
        data: vehicle,
      });
    }
  );
};

exports.customerApproval = (req, res) => {
  Customer.findOneAndUpdate(
    { _id: req.params.customerId },
    { $set: req.body },
    { new: true },

    function (err, customer) {
      if (err) {
        return res.status(422).json({
          success: false,
          message: "Error occured while processing the request",
        });
      }

      if (!customer) {
        return res.status(422).json({
          success: false,
          message: "Invalid customer id!",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Status updated!!",
        data: customer,
      });
    }
  );
};

exports.addToken = async (req, res) => {
  console.log("body", req.body);
  try {
    const newtoken = await Token(req.body);

    newtoken.save((err, token) => {
      if (err) {
        return res.status(422).json({
          success: false,
          message: "Unable to create token!",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "New token is created!",
          data: token,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateFuelRequestStatus = (req, res) => {
  CustomerFuelRequest.findOneAndUpdate(
    { _id: req.params.requestId },
    { $set: req.body },
    { new: true },

    function (err, request) {
      if (err) {
        return res.status(422).json({
          success: false,
          message: "Error occured while processing the request",
        });
      }

      if (!request) {
        return res.status(422).json({
          success: false,
          message: "Invalid request id!",
        });
      } else {
        if (request.status === fuelRequestStatusType.APPROVED) {
          const date = new Date();

          Token.findOneAndUpdate(
            { vehicle_id: request.vehicleId, user_id: request.customerId },
            {
              requestedFuelAmount: request.requestedFuelAmount,
              expireDate: DateHelper.addWeeksToDate(date, 1),
              status: fuelTokenStatusType.APPROVED,
            },
            {new:true,populate:["user_id","vehicle_id"]}
          )
            .then((t) => {
              console.log("token updated", t);
              sendMail(t.user_id.email,{description:"Make the payment!",note:"Vehicle No: "+t.vehicle_id.vehicleNumber, subject:"Make the payment!", text:"Now, you can complete the payment."})
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      return res.status(200).json({
        success: true,
        message: "Status updated!!",
        data: request,
      });
    }
  );
};
