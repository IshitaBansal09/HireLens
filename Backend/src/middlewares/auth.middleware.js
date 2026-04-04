const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function authUser(req, res, next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message : "Unauthorized, token not found"
        })
    }
    // now gonna verify token and retrieve data from that
    // token verification  
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })
    if(isTokenBlacklisted){
        return res.status(401).json({
            message : "Token is invalid"
        })
    }
    // data retrieval 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)  // decoded => is variable ka use krte hai jb token ke ander ke data ko hm nikal rha hai, or save kr rhe hai, toh is variable mein krtee hai
        req.user = decoded
        next()  // next function is used to move to the next middleware or controller function, after this middleware function is executed
    }
    catch(err){
        return res.status(401).json({
            message : "Unauthorized, invalid token"
        })
    }
    
}

module.exports = {authUser}