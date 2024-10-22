const userModel = require('../models/user-model')
const hisaabModel = require('../models/hisaab-model');
const { isLoggedIn } = require('../middlewares/auth-middleware');

module.exports.hisaabPageController= function(req,res){
    res.render('create');
}

module.exports.createHisaabController= async function(req,res){
    //title,user,description,passcode,shareable,encrypted, editpermissions
    let{title,description,passcode,shareable,encrypted,editpermissions}=req.body;
    shareable= shareable === "on" ? true:false
    encrypted= encrypted === "on" ? true:false
    editpermissions= editpermissions === "on" ? true:false
    
    try{
        let createdHisaab = await hisaabModel.create({
            title,
            description,
            user:req.user._id,
            passcode,
            shareable,
            encrypted,
            editpermissions
        })
       
        let user = await userModel.findOne({email:req.user.email})
        user.hisaab.push(createdHisaab._id);
        await user.save();
        res.redirect('/profile')
    
    
    }
    catch(err){
        res.send(err.message)
    }
}

module.exports.viewHisaabController = async function(req,res){
    const id = req.params._id;
    const hisaab =await hisaabModel.findOne({_id:id})

    if(!hisaab) return res.redirect('/profile');

    if(hisaab.encrypted){
        return res.render('passcode',{id})
    }

    return res.render('hisaab',{hisaab})
}
module.exports.viewVerifiedHisaabController = async function(req,res){
    const id = req.params._id;
    const hisaab = await hisaabModel.findOne({_id:id,user: req.user._id});

    if(!hisaab || hisaab.passcode !== req.body.passcode) return res.redirect('/profile')

    return res.render('hisaab',{hisaab})
}

module.exports.deleteHisaabController = async function(req,res){
    const id = req.params._id;
    const hisaab = await hisaabModel.findOne({_id:id, user:req.user._id})

    if(!hisaab){
        return res.redirect('/profile')
    }

    await hisaabModel.deleteOne({_id:id})

    let user = await userModel.findOne({email:req.user.email})
    let deleted = user.hisaab.indexOf(hisaab._id);
    // user.hisaab.splice(deleted,1);
    if (deleted !== -1) {
        user.hisaab.splice(deleted, 1); // Modify `user.hisaab`, not `hisaab`
    }
    await user.save();
    return res.redirect('/profile')
}

module.exports.editController = async function(req,res){
    const id = req.params._id;
    
    const hisaab = await hisaabModel.findOne({_id:id})
    if(!hisaab) return res.redirect ('/profile')
    return res.render('edit',{hisaab})
}

module.exports.editHisaabController = async function(req,res){
    const id = req.params._id;

    const hisaab = await hisaabModel.findById(id);

    let{title,description,passcode,shareable,encrypted,editpermissions}=req.body;
    hisaab.title = title
    hisaab.description= description
    hisaab.passcode= passcode
    hisaab.shareable= shareable === "on" ? true:false
    hisaab.encrypted= encrypted === "on" ? true:false
    hisaab.editpermissions= editpermissions === "on" ? true:false

    await hisaab.save();

    return res.redirect('/profile')
    
}

module.exports.shareHisaabController = async function(req, res) {
    try {
        const id = req.params._id;
        const hisaab = await hisaabModel.findOne({ _id: id });

        if (!hisaab) {
            req.flash('error', "Hisaab not found or you don't have permission to share it");
            return res.redirect('/profile');
        }

        if (!hisaab.shareable) {
            req.flash('error', "This hisaab cannot be shared");
            return res.redirect('/profile');
        }

        // Redirect to the same hisaab page with a success flag
        return res.redirect(`/hisaab/view/${id}?copyLink=true`);

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while generating the shareable link');
        return res.redirect('/profile');
    }
};
