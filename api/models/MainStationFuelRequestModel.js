let mongoose = require("mongoose");
const statusType = require("../enums/FuelRequestStatusType");
let Schema = mongoose.Schema;

let MainStationFuelRequestModelSchema = new Schema({
  subStationId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubStation",
    required: [true, 'Substation Id is required!']
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

const FuelRequestMainStation = mongoose.model("FuelRequestMainStation", MainStationFuelRequestModelSchema);
module.exports = { FuelRequestMainStation };
