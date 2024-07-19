const express = require('express');
const router = express.Router();

const{landingPageController,registerController,registerPageController,
    loginController,
    logoutController,
    profileController
}= require('../controllers/index-controller');
const { isLoggedIn, redirectIfLoggedIn } = require('../middlewares/auth-middleware');

router.get('/',redirectIfLoggedIn,landingPageController);
router.get('/register',registerPageController);

router.get('/login',landingPageController)
router.get('/profile',isLoggedIn,profileController);

router.get('/logout',logoutController);

router.post('/login',loginController);
router.post('/register',registerController);

module.exports = router;
