//TODO
const { SubStation } = require("../models/SubStationModel");
const { FuelRequestMainStation } = require("../models/MainStationFuelRequestModel");
const { FuelRequest } = require('../models/FuelRequestModel');
const statusType = require("../enums/FuelRequestStatusType");
const mongoose = require("mongoose");
const { User } = require("../models/UserModel");
const UserRole = require("../enums/UserRole");
const { SuperAdmin } = require("../models/SuperAdminModel");
const { CustomerFuelRequest } = require("../models/CustomerFuelRequestModel");
const FuelRequestStatusType = require("../enums/FuelRequestStatusType");
const sendMail = require("../services/mail");
const { Token } = require("../models/TokenModel");
const { DateHelper } = require("../helpers/date");
const fuelTokenStatusType = require("../enums/FuelTokenStatusType");

exports.addSubStation = async (req, res) => {
  console.log("new substation adding", req.body);
  const substationData = req.body
  const userData = {
    username: substationData.ownerName,
      phone: substationData.ownerMobile,
      email: substationData.ownerEmail,
      password: "test123",
      userType: UserRole.ADMIN
  }
  const user = new User(userData);

  user.save((err) => {
    if (err) {
      return res.status(422).json({
        success: false,
        message: "Registration failed check validation errors!",
        data: err.message,
      });
    } else {
      let newSubStation = new SubStation(req.body);

      newSubStation.save((err, station) => {
        if (err) {
          return res.status(422).json({
            success: false,
            message: "Unable to create sub station!",
            data: err,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "New sub station is created!",
            data: station,
          });
        }
      });
    }
  });


};

exports.getSubstationFuelRequests = async (req, res) => {
  try {
    const requests = await FuelRequestMainStation.find();

    return res.status(200).json({
      success: true,
      message: "Received requests!",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSubstationFuelRequestStatus = (req, res) => {
   FuelRequestMainStation.findOneAndUpdate(
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
      }
      const date = new Date();

      if(request.status === FuelRequestStatusType.APPROVED){
        CustomerFuelRequest.find({subStationId:request.subStationId, status:FuelRequestStatusType.PENDING},{},{populate:['customerId','vehicleId']}).then((rqs)=>{
          rqs.forEach((r)=>{
            console.log("send mail")
            CustomerFuelRequest.findOneAndUpdate(
              { _id: r._id },
              { $set: fuelTokenStatusType.APPROVED },
              { new: true }).then((t) => {
                console.log("token updated", t);
              })
              .catch((err) => {
                console.log(err);
              });

            Token.findOneAndUpdate(
              { vehicle_id: r.vehicleId, user_id: r.customerId },
              {
                requestedFuelAmount: r.requestedFuelAmount,
                expireDate: DateHelper.addWeeksToDate(date, 1),
                status: fuelTokenStatusType.APPROVED,
              },
              {new:true,populate:["user_id","vehicle_id"]}
            ).then((t) => {
              console.log("token updated", t);
            })
            .catch((err) => {
              console.log(err);
            });
            sendMail(r.customerId.email,{description:"Make the payment!",note:"Vehicle No: "+r.vehicleId.vehicleNumber, subject:"Make the payment!", text:"Now, you can complete the payment."})
          })
        })
      }

      return res.status(200).json({
        success: true,
        message: "Status updated!!",
        data: request,
      });
    }
  );
};

//TODO: GET FUEL QUOTA FOR CHART
exports.getFuelChartDetails = async (req, res) => {
  try {
    const fuelRequest = await FuelRequestMainStation.find();
    let totalRequestedPetrolAmount = 0;
    let totalRequestedDiesalAmount = 0;
    let totalIssuedPetrolAmount = 0;
    let totalIssuedDiesalAmount = 0;
    let totalAvailalePetrolAmount = 50000;
    let totalAvailaleDiesalAmount = 50000;


    console.log('fuelRequest', fuelRequest)
    if (fuelRequest.length > 0) {
      fuelRequest.forEach((request) => {
        if (request.status === statusType.PENDING) {
          if (request.dieselAmount) {
            totalRequestedDiesalAmount += request.dieselAmount;
          }
          if (request.petrolAmount) {
            totalRequestedPetrolAmount += request.petrolAmount;
          }
        } else if (request.status === statusType.APPROVED) {
          if (request.dieselAmount) {
            totalIssuedDiesalAmount += request.dieselAmount;

          }
          if (request.petrolAmount) {
            totalIssuedPetrolAmount += request.petrolAmount;
          }
        }
        
      })
    }

    return res.status(200).json({
      success: true,
      message: "Received sub data!",
      data: {
        totalRequestedDiesalAmount: totalRequestedDiesalAmount,
        totalRequestedPetrolAmount: totalRequestedPetrolAmount,
        totalAvailaleDiesalAmount: totalAvailaleDiesalAmount,
        totalAvailalePetrolAmount: totalAvailalePetrolAmount,
        totalIssuedDiesalAmount: totalIssuedDiesalAmount,
        totalIssuedPetrolAmount: totalIssuedPetrolAmount
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//TODO: ADD FUEL
exports.addFuel = async (req, res) => {
  console.log("new fuel adding", req.body);
  let newFuelRequest = new FuelRequestMainStation(req.body);

  newFuelRequest.save((err, station) => {
    if (err) {
      return res.status(422).json({
        success: false,
        message: "Unable to add fuel request!",
        data: err,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "New fuel request added!",
        data: station,
      });
    }
  });
};

//TODO: GET ALL SUBSTATIONS
exports.getAllSubStations = async (req, res) => {
  try {
    const subStations = await SubStation.find();

    return res.status(200).json({
      success: true,
      message: "Received sub stations!",
      data: subStations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFuelRequests = async (req, res) => {
  console.log("get fuel requests")
  try {
    const fuelRequests = await FuelRequestMainStation.find();

    return res.status(200).json({
      success: true,
      message: "Received fuel requests!",
      data: fuelRequests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//TODO: UPDATE SUBSTATION STATUS ("APPROVE", "REJECT","ISSUED")
exports.updateSubStation = (req, res) => {
  console.log("update substation");
  SubStation.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true },

    function (err, substationRequest) {
      if (err) {
        return res.status(422).json({
          success: false,
          message: "Error occured while processing the request",
        });
      }

      if (!substationRequest) {
        return res.status(422).json({
          success: false,
          message: "Invalid sub station id!",
        });
      } else {

        return res.status(200).json({
          success: true,
          message: "Status updated!!",
          data: substationRequest,
        });
      }
    }
  );
};

exports.getFuelAmount = async (req, res) => {
  console.log("get fuel");
  try {
    const superAdmin = await SuperAdmin.findOne({user_id:req.user._id});

    return res.status(200).json({
      success: true,
      message: "Received super admin!",
      data: superAdmin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

