const mongoose = require("mongoose"); 

const User = mongoose.model("User", {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    dob: String
})
const userModel = { User };
module.exports = userModel;