const express = require('express')
const router = express.Router()
const {createHisaabController,hisaabPageController,viewHisaabController,viewVerifiedHisaabController,deleteHisaabController,editController,editHisaabController,shareHisaabController} = require('../controllers/hisaab-controller')
const { isLoggedIn, redirectIfLoggedIn } = require('../middlewares/auth-middleware');

router.get('/create',isLoggedIn,hisaabPageController);
router.post('/create',isLoggedIn,createHisaabController);

router.get('/view/:_id',isLoggedIn,viewHisaabController);
router.post('/:_id/verify',isLoggedIn,viewVerifiedHisaabController);
router.get('/delete/:_id',isLoggedIn,deleteHisaabController);

router.get('/edit/:_id',isLoggedIn,editController);
router.post('/edit/:_id',isLoggedIn,editHisaabController)

// router.post('/share/:_id', shareHisaabController);





module.exports=router;