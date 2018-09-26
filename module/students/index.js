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
        function (cb) { //检测账户名是否存在
            let sql = 'select s_account from students where s_account=?';
            conn.query(sql, data.account, (err, results) => {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 'error',
                        message: '数据库错误！'
                    });
                    return;
                }
                cb(null, results.length);
            })
        },
        function (count, cb) { //完成数据库写入操作
            if (count !== 0) {
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
                cb(null, {
                    status: 'ok'
                })
            })
        }
    ], (err, result) => {
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
    if (!req.session.account) {
        res.redirect('/students/login.html');
        return;
    }
    async.series({
        stu: function (cb) {
            //测试数据
            cb(null, {
                account: req.session.account,
                name: req.session.name,
                sex: req.session.sex,
                class: req.session.class,
                specialty: req.session.specialty
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
                    // console.log(re)
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
            let sql = 'select count(n_id) as sum, n_id,n_title,n_content,n_time from notice limit 0,1';
            conn.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                results.number = results.length;
                cb(null, results)
            })
        },
        answer: function (cb) {
            //答案
            cb(null, {})
        },

    }, (err, results) => {
        // console.log(results instanceof Object)
        res.render('./students/info', results);
    })
    //课程数据


})

//退出登录
router.get('/logout', (req, res) => {
    req.session = null,
        res.json({
            status: 'ok',
            message: '退出成功！'
        })
})

//修改密码
router.post('/updatepassword', (req, res) => {
    //登录状态检查
    if (!req.session.account) {
        res.json({
            status: 304,
            message: '请先登录！',
            url: '/students/login.html'
        })
        return;
    }
    //验证码验证
    let data = req.body;
    let se = req.session;
    if (!req.session.captcha || data.coder.toLowerCase() !== req.session.captcha.toLowerCase()) {
        res.json({
            status: 'error',
            message: '验证码错误！'
        })
        return;
    }
    async.series({
        check: function (cb) {
            let sql = 'select s_password from students where s_account = ?';
            conn.query(sql, se.account, (err, results) => {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 'error',
                        message: '系统错误！，修改失败！'
                    })
                    return;
                }
                if (data.oldpassword !== results[0].s_password) {
                    res.json({
                        status: 'error',
                        message: '旧密码错误！'
                    })
                    return;
                }
                cb(null, null);
            })
        },
        update: function (cb) {
            let sql = 'update students set s_password=? where s_account=?';
            conn.query(sql, [data.password, se.account], (err, results) => {
                if (err) {
                    res.json({
                        status: 'error',
                        message: '系统错误！，修改失败！'
                    })
                    return;
                }
                res.json({
                    status: 'ok',
                    message: '密码修改成功！'
                })
                cb(null, null)
            })
        }
    }, (err, re) => {
        console.log(err || re);
    })
})

//发布公告
router.post('/notice', (req, res) => {
    //登录状态检查
    if (!req.session.account) {
        res.json({
            status: 304,
            message: '请先登录！',
            url: '/students/login.html'
        })
        return;
    }
    let body = req.body;
    let se = req.session;
    let sql = 'insert into notice (n_title,n_content,n_class,n_account,n_name,n_time)values(?,?,?,?,?,?)'
    conn.query(sql, [body.title, body.content, se.class, se.account, se.name, (new Date()).toLocaleString()], (err, results) => {
        if (err) {
            console.log(err);
            res.json({
                status: 'error',
                message: '系统错误！，保存失败！'
            })
            return;
        }
        res.json({
            status: 'ok',
            message: '保存成功！'
        })
    })
})

//加载更多公告
router.post('/load', (req, res) => {
    //登录状态检查
    if (!req.session.account) {
        res.json({
            status: 304,
            message: '请先登录！',
            url: '/students/login.html'
        })
        return;
    }
    let body = req.body;
    let num = body.num * 1;
    if (num >= body.sum * 1) {
        res.json({
            status: 'error',
            message: '已到最后！'
        })
        return;
    }
    // let sql = 'select n_id,n_title,n_content,n_time from notice limit ?,10';
    let sql = 'select n_id,n_title,n_time from notice limit ?,10';
    conn.query(sql, num, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        res.json({
            re: results,
            num: num + results.length
        });
    })
})
//获取公告内容
router.post('/content', (req, res) => {
    let sql = 'select n_content from notice where n_id = ?';
    conn.query(sql, req.body.id*1, (err, results) => {
        if (err) {
            console.log(err);
            res.json({
                status: 'error',
                message: '系统错误！'
            })
            return;
        }
        res.end(results[0].n_content);
    })
})
module.exports = router;