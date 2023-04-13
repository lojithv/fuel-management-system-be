let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AdminModelSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required!"],
  },
  stationName: {
    type: String,
  },
  address: {
    type: String,
  },
  ownerName: {
    type: String,
  },
  ownerMobile: {
    type: String,
  },
  ownerEmail: {
    type: String,
  },
  elegibleFuelAmount: {
    type: Number,
  },
  dieselAmount: {
    type: Number,
  },
  petrolAmount: {
    type: Number,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("Admin", AdminModelSchema);
module.exports = { Admin };
