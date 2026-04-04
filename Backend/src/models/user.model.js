const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type : String,
        unique : [true,"username already taken"],
        required : true,
    },

    email:{
        type: String,
        unique: [true, "Account already exists with this email address"],
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("users", userSchema) // users is the collection name=> jisme user ka data store horha hoga

module.exports = userModel