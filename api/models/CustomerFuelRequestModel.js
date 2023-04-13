let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const statusType = require("../enums/FuelRequestStatusType");


let CustomerFuelRequestModelSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer Id is required!']
  },
  vehicleId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, "VehicleId is required!"],
  },
  requestedFuelAmount: {
    type: Number,
    required: [true, "Requested fuel amount is required!"],
  },
  subStationId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'SubStation',
    required: [true, "Substation Id is required!"],
  },
  requestedDate: {
    type: Date,
    default: Date.now,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  paymentId:{
    type:String,
    required:false
  },
  status: {
    type: String,
    enum: statusType,
    default: statusType.PENDING,
    required: true,
  }
});

const CustomerFuelRequest = mongoose.model("CustomerFuelRequest", CustomerFuelRequestModelSchema);
module.exports = { CustomerFuelRequest };
