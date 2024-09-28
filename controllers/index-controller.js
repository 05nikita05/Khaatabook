const userModel = require("../models/user-model");
const hisaabModel = require("../models/hisaab-model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


module.exports.landingPageController=function(req,res){
    res.render("index",{loggedin:false});
}

module.exports.registerPageController= function(req,res){
    res.render('register',{loggedin:false});
}

module.exports.registerController=async function(req,res){
    let {email,username,name,password} = req.body;

    if(!email || !username || !name || !password){
        // req.flash("error","All fields are required.")
        return res.redirect('/register')
    }

   try{
    let user = await userModel.findOne({email});
    if(user){
        req.flash("error","already have an account");
        return res.redirect('/register')
    }


    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(password,salt)

    user = await userModel.create({
        email,
        name,
        username,
        password:hashed,
    });

    let token = jwt.sign({id:user._id,email:user.email},process.env.JWT_KEY)
    
    res.cookie("token",token);
    res.redirect("profile")
}
   catch(err){
    res.send(err.message);
   }
}

module.exports.loginController= async function(req,res){
    let {email,password}=req.body;

    let user = await userModel.findOne({email}).select("+password");
    if(!user){
        req.flash("error","register yourself");
        return res.redirect('/register')
    }

    
    let result =  await bcrypt.compare(password,user.password);
    if(!result) {
        req.flash("error","incorrect credentials");
        return res.redirect('/login')
    }


    let token = jwt.sign({id:user._id,email:user.email},process.env.JWT_KEY)
    
    res.cookie("token",token);
    res.redirect("profile")
}
   
module.exports.logoutController= function(req,res){
    res.cookie("token","");
    res.redirect("/");
}

module.exports.profileController= async function(req,res){
    let byDate =Number (req.query.byDate)
    let {startDate,endDate} =  req.query

    byDate=byDate ? byDate : -1
    startDate = startDate ? startDate : new Date("1970-01-01")
    endDate = endDate ? endDate : new Date()

    let user = await userModel.findOne({email:req.user.email}).populate({
        path:"hisaab", match:{createdAt:{$gte: startDate , $lte: endDate}},
        options:{sort: {createdAt: byDate}}
    })
    res.render("profile",{user})
}
/* U8uj8lZF4Z8pXNin
 */