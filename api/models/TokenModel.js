let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const FuelType = require("../enums/FuelType");
const statusType = require("../enums/FuelTokenStatusType");


let TokenModelSchema = new Schema({
  token: {
    type: String,
    required: [true, "Token is required!"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required!"],
  },
  vehicle_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, "VehicleId is required!"],
  },
  requestedFuelAmount:{
    type:Number,
    required:false,
    default:0
  },
  issuedFuelAmount:{
    type:Number,
    required:false,
    default:0
  },
  fuelType: {
    type: String,
    enum:FuelType,
    required: [true, "Fuel type field is required!"],
  },
  fuelLimit: {
    type: Number,
    required: [true, "Requested fuel limit is required!"],
  },
  expireDate: {
    type: Date,
    required: [true, "Token expire date is required!"],
  },
  status: {
    type: String,
    enum: statusType,
    default: statusType.NEW,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Token = mongoose.model("Token", TokenModelSchema);
module.exports = { Token };
