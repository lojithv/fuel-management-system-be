let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let SuperAdminModelSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required!"],
  },
  dieselAmount: {
    type: Number,
    required:false
  },
  petrolAmount: {
    type: Number,
    required:false
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const SuperAdmin = mongoose.model("SuperAdmin", SuperAdminModelSchema);
module.exports = { SuperAdmin };
