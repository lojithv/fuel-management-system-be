const UserRole = require("../enums/UserRole");
const {Vehicle} = require("../models/VehicleModel");
const { User } = require("../models/UserModel");
const { SubStation } = require("../models/SubStationModel");

exports.registerUser = async (req, res) => {
  const userData = req.body.userData
    ? { ...req.body.userData }
    : null;

  const vehicleDetails = req.body.vehicleDetails;

  if (userData && vehicleDetails) {
    await Vehicle.findOne({
      vehicleNumber: vehicleDetails.vehicleNumber,
    }).then(async (c, err) => {
      if (!c) {
        const user = new User(userData);

        user.save(async (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(422).json({
              success: false,
              message: "Registration failed check validation errors!",
              data: err.message,
            });
          } else {
            console.log(doc);
            const vehicle = new Vehicle({
              ...vehicleDetails,
              user_id: user._id,
            });
            vehicle.save((err, vehicle) => {
              if (err) {
                return res.status(422).json({
                  success: false,
                  message: "Registration failed check validation errors!",
                  data: err.message,
                });
              } else {
                return res.status(200).json({
                  success: true,
                  message: "Successfully Signed Up!",
                  user: user,
                  data: vehicle,
                });
              }
            });
          }
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid vehicle number!" });
      }
    });
  } else {
    return res.status(400).json({ success: false, message: "Invalid Data!" });
  }
};

exports.registerAdmin = async (req, res) => {
  const user = new User(req.body);

  user.save((err) => {
    if (err) {
      return res.status(422).json({
        success: false,
        message: "Registration failed check validation errors!",
        data: err.message,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Successfully Signed Up!",
        user: user,
      });
    }
  });
};

exports.loginUser = (req, res) => {
  console.log("login");
  console.log(req.body);
  User.findOne({ email: req.body.email }).then((user, err) => {
    if (!user) {
      console.log('lll')
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email!" });
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        //isMatch is eaither true or false
        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid Password!" });
        } else {
          user.generateToken((err, token) => {
            if (err) {
              return res.status(400).send({ success: false, message: err });
            } else {
              if(user.userType === UserRole.ADMIN) {
                SubStation.findOne({ownerEmail:req.body.email}).then((substation,error)=>{
                  if(substation){
                    return res.status(200).json({
                      success: true,
                      message: "Successfully Logged In!",
                      data: {
                        token: token,
                      },
                      user: user,
                      substation:substation
                    });
                  } else {
                    return res.status(400).send({ success: false, message: error });
                  }
                })
              } else {
                return res.status(200).json({
                  success: true,
                  message: "Successfully Logged In!",
                  data: {
                    token: token,
                  },
                  user: user
                });
              }
  
              // console.log(res);
            }
          });
        }
      });
    }
  });
};

exports.loginCustomer = (req, res) => {
  console.log("login-customer");
  console.log(req.body);
  Vehicle.findOne({ vehicleNumber: req.body.vehicleNumber }).then((vehicle, err) => {
    if (!vehicle) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Vehicle number!" });
    } else {
      console.log("vehicle", vehicle)
      User.findOne({ _id: vehicle.user_id }).then((user, err) => {
        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid user_id!" });
        } else {
          user.comparePassword(req.body.password, (err, isMatch) => {
            //isMatch is eaither true or false
            if (!isMatch) {
              return res
                .status(400)
                .json({ success: false, message: "Invalid Password!" });
            } else {
              user.generateToken((err, token) => {
                if (err) {
                  return res.status(400).send({ success: false, message: err });
                } else {
                  // console.log(res);
                  return res.status(200).json({
                    success: true,
                    message: "Successfully Logged In!",
                    data: {
                      token: token,
                    },
                    user: user,
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.getUserDetails = (req, res) => {
  res.json({ status: true, message: "User Received!", data: req.user });
};
