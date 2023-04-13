//todo

const UserRole = require("../enums/UserRole");
const { SuperAdmin } = require("../models/SuperAdminModel");
const { User } = require("../models/UserModel");

exports.addSuperAdmin = async () => {
  const userData = {
    username: "SuperAdminSS",
      phone: "0774412849",
      email: "SuperAdminSS@gmail.com",
      password: "test123",
      userType: UserRole.SUPER_ADMIN
  }
  const user = new User(userData);

  user.save((err, doc) => {
    if (err) {
      console.log(err);
    } else {
      console.log(doc);
      const superAdmin = new SuperAdmin({ user_id: doc._id, dieselAmount: 0, petrolAmount: 0 });
      superAdmin.save((err,doc1)=>{
        if(err){
          console.log(err)
        } else {
          console.log(doc1)
        }
      })
    }
  });
};
