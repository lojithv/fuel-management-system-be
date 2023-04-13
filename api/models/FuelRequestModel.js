let mongoose = require("mongoose");
const statusType = require("../enums/FuelRequestStatusType");
let Schema = mongoose.Schema;

let FuelRequestModelSchema = new Schema({
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubStation',
    required: [true, "Station name is required!"],
  },
  dieselAmount: {
    type: Number,
    required: false,
  },
  petrolAmount: {
    type: Number,
    required: false,
  },
  requestedDate: {
    type: Date,
    default: Date.now,
  },
  expectedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: statusType,
    default: statusType.PENDING,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const FuelRequest = mongoose.model("FuelRequest", FuelRequestModelSchema);
module.exports = { FuelRequest };
