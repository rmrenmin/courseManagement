const express = require('express');
const async = require('async');
const router = express.Router();

//验证
router.use((req, res, next) => {
    if (!req.session.tid) {
        res.redirect('/teacher/');
    };
    next();
});


//个人中心
router.get('/', (req, res) => {
    let idata = {};

    idata.tid = req.session.tid;
    idata.tname = req.session.tname;
    idata.taccount = req.session.taccount;
    idata.tpassword = req.session.tpassword;
    idata.ttimes = req.session.ttimes;
    // console.log(req.session);
    // console.log(idata);
    res.render('teacher/i', idata);
});


//返回登陆首页
router.get('/teacher/', (req, res) => {
    res.redirect('/teacher/');
});



//查询课表
router.get('/lesson', (req, res) => {
    let idata = {};
    idata.tid = req.session.tid;
    idata.tname = req.session.tname;
    idata.taccount = req.session.taccount;
    idata.tpassword = req.session.tpassword;
    arr=[{}, {}, {}, {}, {}];
    idata.ttimes = req.session.ttimes;
    idata.arr = arr;
    let sql = 'SELECT * FROM curricuium where c_account = ?';
    conn.query(sql, [req.session.taccount], (err, results) => {
        for (let obj of results) {
            arr[Math.floor(obj.c_time / 10) - 1][obj.c_time % 10] = obj;
        };
        console.log(arr);
        res.render('teacher/lesson', idata);
    });
});

//查询学生信息
router.get('/tstudents',(req,res)=>{
    let idata = {};
    idata.tid = req.session.tid;
    idata.tname = req.session.tname;
    idata.taccount = req.session.taccount;
    idata.tpassword = req.session.tpassword;
    res.render('teacher/tstudents',idata);
})

//查询学生信息
router.post('/tstudents',(req,res)=>{
    // console.log(req.body);
    let sql = 'SELECT s.* , c.c_specialty FROM students AS s LEFT JOIN class AS c ON s.s_class = c.c_class WHERE s.s_status = 1 AND s.s_class=?';
    conn.query(sql,[req.body.sclass],(err,result)=>{
        // console.log(result);
        if(!result.length){
            res.json({re:'no_class'});
            return;
        }
        req.session.sinfo = result;
        res.json({re:'ok'});
    });
});

//显示学生信息页面
router.get('/sinfo',(req,res)=>{
    let idata = {};
    idata.tid = req.session.tid;
    idata.tname = req.session.tname;
    idata.taccount = req.session.taccount;
    idata.tpassword = req.session.tpassword;
    idata.sinfo = req.session.sinfo;
    console.log(idata);
    res.render('teacher/sinfo',idata);
});



//进入修改页面密码
router.get('/ipasswd', (req, res) => {
    let idata = {};

    idata.tid = req.session.tid;
    idata.tname = req.session.tname;
    idata.taccount = req.session.taccount;
    idata.tpassword = req.session.tpassword;
    idata.ttimes = req.session.ttimes;
    res.render('teacher/ichange', idata);
});



// 修改密码
router.post('/ipasswd', (req, res) => {
    let sql = 'UPDATE teacher SET t_password=? where t_id=?';
    // console.log(req.session.tid);
    // console.log(req.body.password);
    conn.query(sql, [req.body.password, req.session.tid], (err, result) => {
        res.json({
            re: 'ok'
        });
    });
});


module.exports = router;