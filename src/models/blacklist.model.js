const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be added in blacklist"]
    }
},{
    timestamps: true  // means token kb blacklist me add hua tha, aur kb expire hoga, ye dono details automatically save ho jayengi, database khud ye sb manage kr lega
})

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)

module.exports = tokenBlacklistModel