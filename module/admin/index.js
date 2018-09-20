const express = require('express');
const async = require('async');
const router = express.Router();

//test
// router.get('/',(req,res)=>{
//     res.send('ok');
// })

//主页面
router.get('/',(req,res)=>{
    //直接返回登陆界面
    res.render('./admin/index');
});



//登陆验证


module.exports = router;