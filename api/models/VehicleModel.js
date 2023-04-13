let mongoose = require("mongoose");
const FuelType = require("../enums/FuelType");
const VehicleType = require("../enums/VehicleType");
const vehicleStatusType = require("../enums/VehicleStatusType");
let Schema = mongoose.Schema;

let VehicleModelSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required!"],
  },
  vehicleNumber: {
    type: String,
    unique: true,
    required: [true, "vehicleNumber is required!"],
  },
  vehicleType: {
    type: String,
    enum: VehicleType,
    required: [true, "vehicleType is required!"],
  },
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubStation",
    required: [true, "SubStation field is required!"],
  },
  fuelType: {
    type: String,
    enum: FuelType,
    required: [true, "fuelType is required!"],
  },
  vehicleQuota: {
    type: Number,
    required: [true, "vehicleQuota is required!"],
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: vehicleStatusType,
    default: vehicleStatusType.PENDING,
    required: true,
  }
});

const Vehicle = mongoose.model("Vehicle", VehicleModelSchema);
module.exports = { Vehicle };
