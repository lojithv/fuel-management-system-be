const { addSuperAdmin } = require("./SuperAdminSeed");

require("dotenv").config();

const mongoose = require("mongoose");
const { addAdmin } = require("./AdminSeed");
const { addCustomer } = require("./CustomerSeed");

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database', error)
    }else {
        return console.log('Successfully connected to database')
    }
});

addSuperAdmin()
// addAdmin()
// addCustomer()