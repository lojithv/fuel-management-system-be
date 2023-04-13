let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let SubStationModelSchema = new Schema({
  stationName: {
    type: String,
    required: [true, "Station name is required!"],
  },
  address: {
    type: String,
    required: [true, "Address is required!"],
  },
  ownerName: {
    type: String,
    required: [true, "Owner name is required!"],
  },
  ownerMobile: {
    type: String,
    required: [true, "Owner mobile is required!"],
  },
  ownerEmail: {
    type: String,
    required: [true, "Owner email is required!"],
  },
  eligibleFuelAmount: {
    type: Number,
    required: false,
  },
  dieselAmount: {
    type: Number,
    required: false,
  },
  petrolAmount: {
    type: Number,
    required: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const SubStation = mongoose.model("SubStation", SubStationModelSchema);
module.exports = { SubStation };
