const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password in request body
 * @access Public 
 */
// creating register controller function, which will handle the registration of the user, and this function will be called in the auth.routes.js file, when we hit the /register endpoint, and this function will take the request and response as parameters, and this function will return a json response with the message and the user details, if the registration is successful, otherwise it will return an error message
async function registerUserController(req, res) {
    const { username, email, password } = req.body

    if(!username || !email || !password) {
        return res.status(400).json({
            message : "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ {username}, {email}]  // means username ya email kisi ke bhi basis pr agr koi user already existed aata hai, toh ye true return krega
    })

    if(isUserAlreadyExists){
        if(isUserAlreadyExists.username == username){
            return res.status(400).json({
                message: "Account already exists with this username"
            })
        }
        else{
            return res.status(400).json({
                message: "Account already exists with this email address"
            })
        }
    }

    // hashing password now 
    const hash = await bcrypt.hash(password, 10)
    // now going to create a new user corresponding to this hash 
    const user = await userModel.create({
        username, 
        email, 
        password : hash
    })

    // now, creating token for this user 
    const token = jwt.sign(
        {id:user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    // now setting this created token to the cookies 
    res.cookie("token", token)

    res.status(201).json({
        message : "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

// now, creating a login controller function
/**
 * @name loginUserController
 * @description Login a user, expects email and password in request body
 * @access Public 
 */

async function loginUserController(req, res) {
    const { email, password } = req.body
    const user = await userModel.findOne({email})  // email ke basis pr user ko find krna hoga, toh hum findOne method ka use kr rhe hai, aur usme email pass kr rhe hai, toh ye user ko find krke dega, jiska email address match hoga, agar koi user nahi milta hai, toh ye null return krega
    if(!user){
        return res.status(400).json({
            message: "User doesn't exists"
        })
    }

    // agr koi user milta hai, toh hume password ko compare krna hoga, toh hum bcrypt ka compare method use krte hai, jisme pehla parameter me user ke password ka hash pass krte hai, aur dusra parameter me user ke input kiya hua password pass krte hai, toh ye method compare karke true ya false return krega
    const isPasswordValid = await bcrypt.compare(password, user.password)  // password => coming from req.body, and user.password => password saved in database 

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    // means password is valid, toh ab hume token create krna hoga, toh hum jwt ka sign method use krte hai, jisme pehla parameter me user ke id aur username pass krte hai, dusra parameter me JWT secret pass krte hai, jo ki .env file me stored hota hai, aur teesra parameter me token ke expiration time ko set krte hai, toh ye method token create karke dega
    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)
    res.status(201).json({
        message : "User logged in successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

// now creating logout controller function, which will be used to logout the user, and this function will clear the token from the cookies, and also add that token in the blacklist, so that it cannot be used again
async function logoutUserController(req, res){
    const token = req.cookies.token  // pehle token ko cookies se get krna hoga
    if(token){
        await tokenBlacklistModel.create({token})  // phir us token ko blacklist me add krna hoga, jisse wo token future me use na ho sake
    }
    res.clearCookie("token")  // phir cookies se token ko clear krna hoga
    res.status(200).json({
        message: "User logged out successfully"
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController
}