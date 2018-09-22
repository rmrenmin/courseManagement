const express = require('express');
const async = require('async');
const router = express.Router();


// 注册路由页面专业班级下拉框数据
router.get('/register', (req, res) => {
    let sql = 'select c_class,c_specialty from class';
    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.json({
                status: 'error',
                message: err
            });
            return;
        }
        res.json(results);
    })
})
// 注册路由 提交
router.post('/register', (req, res) => {
    let data = req.body;
    if (!req.session.captcha || data.coder.toLowerCase() !== req.session.captcha.toLowerCase()) {
        res.json({
            status: 'error',
            message: '验证码错误！'
        })
        return;
    }
    async.waterfall([
        function(cb){//检测账户名是否存在
            let sql = 'select s_account from students where s_account=?';
            conn.query(sql,data.account,(err,results)=>{
                if (err) {
                    console.log(err);
                    res.json({
                        status: 'error',
                        message: '数据库错误！'
                    });
                    return;
                }
                cb(null,results.length);
            })
        },
        function(count,cb){//完成数据库写入操作
            if(count!==0){
                res.json({
                    status: 'error',
                    message: '账户名已存在！'
                });
                return;
            }
            let sql = 'insert into students (s_name,s_sex,s_account,s_password,s_class)values(?,?,?,?,?)';
            conn.query(sql, [data.name, data.sex, data.account, data.password, data.class], (err, results) => {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 'error',
                        message: '数据库错误！'
                    });
                    return;
                }
                res.json({
                    status: 'ok',
                    message: "注册成功！"
                });
                cb(null,{status:'ok'})
            })
        }
    ],(err,result)=>{
        console.log(result);
    })
    
})
//登录路由
router.post('/login', (req, res) => {
    let body = req.body;
    if (!req.session.captcha || body.coder.toLowerCase() !== req.session.captcha.toLowerCase()) {
        res.json({
            status: 'error',
            message: '验证码错误！'
        });
        return;
    }
    async.series({
        login: function (cb) {
            let sql = 'select s.*,c.c_specialty from students as s left join class as c on s.s_class=c.c_class where s_account=?';
            conn.query(sql, body.account, (err, results) => {
                if (err) {
                    res.json({
                        status: 'error',
                        message: '数据库错误！'
                    });
                    console.log(err);
                    return;
                }
                if (results.length === 0) {
                    res.json({
                        status: 'error',
                        message: '账户不存在！'
                    });
                    return;
                }
                if (results[0].s_password === body.password) {
                    req.session.account = body.account;
                    req.session.name = results[0].s_name;
                    req.session.sex = results[0].s_sex;
                    req.session.class = results[0].s_class;
                    req.session.specialty = results[0].c_specialty;
                    res.json({
                        status: 'ok',
                        message: '登录成功'
                    });
                    cb(null, {
                        status: 'success'
                    });
                } else {
                    res.json({
                        status: 'error',
                        message: '密码错误！'
                    });
                }
            });
            
        },
        update: function (cb) {
            let sql = 'update students set s_times=? where s_account=?';
            conn.query(sql, [new Date().toLocaleString(), body.account], (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                cb(null, {
                    status: 'ok'
                });
            });
            
        }
    }, (err, result) => {
        console.log(result);
    })


})

//个人中心
router.get('/info', (req, res) => {
    //登录状态检查
    // if(!req.session.account){
    //     res.redirect('/students/login.html');
    //     return;
    // }
    async.series({
        stu: function (cb) {
            //测试数据
            cb(null, {
                account: req.session.account || 'test',
                name: req.session.name || '张三',
                sex: req.session.sex || '男',
                class: req.session.class || 201801,
                specialty: req.session.specialty || '计算机科学'
            });
        },
        currinfo: function (cb) {
            //课程数据
            let arr = [{}, {}, {}, {}, {}];
            let sql = 'select c.*,t.t_name from curricuium as c left join teacher as t on c.c_account=t.t_account where c.c_class=?';
            conn.query(sql, req.session.class || 201801, (err, re) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(re)
                    for (let obj of re) {
                        let start = obj.c_start;
                        let end = obj.c_end;
                        obj.c_start = `${start.getFullYear()}.${start.getMonth()}.${start.getDate()}`;
                        obj.c_end = `${end.getFullYear()}.${end.getMonth()}.${end.getDate()}`
                        arr[Math.floor(obj.c_time / 10) - 1][obj.c_time % 10] = obj;
                    }
                }
                cb(null, arr);
            })
        },
        notice: function (cb) {
            //公告
            cb(null, {})
        },
        answer: function (cb) {
            //答案
            cb(null, {})
        },

    }, (err, results) => {
        console.log(results)
        res.render('./students/info', results);
    })
    //课程数据


})
module.exports = router;