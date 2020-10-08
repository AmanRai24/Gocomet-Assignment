const express=require("express");
const router=express.Router();
const homeController=require('../controllers/home-controller');

console.log('router loaded');

router.get('/',homeController.index);
router.get('/history',homeController.history);

module.exports=router;