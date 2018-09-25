const express = require('express');
const async = require('async');
const router = express.Router();


//test
// router.get('/',(req,res)=>{
//     res.send('teacher ok');
// })


//登陆页面
router.get('/',(req,res)=>{
    res.render('teacher/index');
});

//登陆验证
router.post('/',(req,res)=>{
    // console.log(req.session);
    // console.log(req.body);
    let coder =req.body.coder;
        if(req.session.captcha.toLowerCase()!= coder.toLowerCase()){
            console.log(777);
            res.json({re:'coder_error'});
            return;
        }
    //验证账号
    let sql = 'SELECT * FROM teacher where t_status = 1 AND t_account = ?';
    conn.query(sql,[req.body.username],(err,result)=>{
        // console.log(result);
        if(!result.length){
            res.json({re:'name_not'});
            return;
        }

        if((req.body.password!=result[0].t_password)){
            res.json({re:'password_error'});
            return;
        }
        //登陆成功
        req.session.tid = result[0].t_id;
        req.session.tname = result[0].t_name;
        req.session.taccount = result[0].t_account;
        req.session.tpassword = result[0].t_password;
        req.session.ttimes = result[0].t_times.toLocaleString();
        let sql ='UPDATE  teacher SET t_times=? where t_id=?';
        conn.query(sql,[new Date().toLocaleString(),result[0].t_id],(err,result)=>{
            res.json({re:'ok'});
        });
        });
    });
        
    











module.exports = router;