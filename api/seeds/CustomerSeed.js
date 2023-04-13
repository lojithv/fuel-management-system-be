//todo

const FuelType = require("../enums/FuelType");
const UserRole = require("../enums/UserRole");
const VehicleType = require("../enums/VehicleType");
const { User } = require("../models/UserModel");
const { Vehicle } = require("../models/VehicleModel");

exports.addCustomer = async () => {
  const userData = {
    username: "SurajaSMS",
    phone: "012347609",
    email: "SurajaSMS@mail.com",
    password: "test123",
    userType: UserRole.CUSTOMER,
  };

  const vehicleDetails = {
    vehicleNumber:"2135674",
    fuelType:FuelType.PETROL,
    vehicleType: VehicleType.CAR
  }

  //Check vehicle number
  Vehicle.findOne({ vehicleNumber: "2135674" }).then(async (c, err) => {
    if (!c) {
      const user = new User(userData);

      user.save(async (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
          const vehicle = new Vehicle({ ...vehicleDetails, user_id: user._id });
          vehicle.save((err, vehicle) => {
            if (err) {
              console.log(err);
            } else {
              console.log(vehicle);
            }
          });
        }
      });
    } else {
      console.log("Vehicle number already exists!");
    }
  });
};
