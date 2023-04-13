//todo

const UserRole = require("../enums/UserRole");
const { User } = require("../models/UserModel");

exports.addAdmin = async () => {
  const userData = {
    username: "Admin",
      phone: "012348593",
      email: "admin@mail.com",
      password: "test123",
      userType: UserRole.ADMIN
  }
  const user = new User(userData);

  await user.save((err, doc) => {
    if (err) {
        console.log(err)
    } else {
        console.log(doc)
    }
});
};
