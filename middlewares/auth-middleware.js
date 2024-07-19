const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isLoggedIn=async function(req,res,next){
    let token = req.cookies.token;
    if(!token) return res.redirect("/");
    try{
        let decoded =  jwt.verify(token,process.env.JWT_KEY);
        let user = await userModel.findOne({email:decoded.email})
        req.user= user;
        
        next();
    }
    catch(err){
        res.redirect("/");
    }
}

module.exports.redirectIfLoggedIn=function(req,res,next){
    let token = req.cookies.token;
    if(!token) return next();
    try{
        let decoded = jwt.verify(token,process.env.JWT_KEY);
        res.redirect("/profile");
    }
    catch(err){
        return next();
    }
}