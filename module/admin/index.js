const express = require('express');
const async = require('async');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('admin/index');
});

//登陆验证
router.post("/login", (req, res) => {
    let d = req.body;
    //首先验证验证码
    console.log(req.session.coder)
    if (!req.session.captcha || d.coder.toLowerCase() !== req.session.captcha.toLowerCase()) {
        res.json({ r: 'coder_err' });
        return;
    }
    let sql = 'SELECT * FROM admin WHERE a_account=?';
    conn.query(sql, d.username, (err, result) => {
        //账号是不是存在
        if (!result.length) {
            res.json({ r: 'u_not' });
            return;
        };
        //判断密码是否正确
        if (d.password != result[0].a_password) {
            res.json({ r: 'p_err' });
            return;
        }
        console.log(result)
        req.session.aid = result[0].a_id;
        req.session.username = result[0].a_account;
        let sql = 'UPDATE admin SET a_times = ? WHERE a_account=?';
        conn.query(sql, [new Date().toLocaleString(), result[0].a_account], (err, result) => {
            res.json({ r: 'ok' });
        });
    })
})
//添加教师账号
router.get("/addtea", (req, ress) => {
    ress.render("admin/admin")
})
router.post("/addtea", (req, ress) => {
    let d = req.body;
    console.log(d)
    let sql = "SELECT * FROM teacher where t_account=?"
    conn.query(sql, d.account, (err, result) => {
        console.log(result)
        if (result.length) {
            ress.json({ r: 'account_exit' });
            console.log("账号存在")
            return;
        }
        let sqll = 'INSERT INTO teacher(t_account, t_name, t_password,t_times) VALUES (?,?,?,?)'
        conn.query(sqll, [d.account, d.username, d.password,new Date().toLocaleString()], (err, result) => {
            ress.json({ r: 'ok' });
        })
    })
})
//教师列表
router.get("/tealist", (req, res) => {
    let pagenum =8;
    let page = req.query.page ? req.query.page : 1;
    (page < 1) && (page = 1);
    async.series({
        totalnums: function (cb) {
            let sql = 'SELECT COUNT(t_id) AS totalnums FROM teacher';
            conn.query(sql, (err, result) => {
                 totalpage = Math.ceil(result[0].totalnums / pagenum);
                 console.log(totalpage)
                if (page > totalpage) {
                    page = totalpage;
                }
                cb(null, result.totalnums);
            });
        },
        lists: function (cb) {
            let sql = 'SELECT * from teacher where t_status=1 LIMIT ?, ?';
            conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
                cb(null, results);
            });
        }
    }, (err, data) => {
        data.page = page;
        data.totalpage = Math.ceil(data.totalnums / pagenum);
        if (totalpage < 5) {
            showpage =totalpage;
        }else{
             showpage =5;
        }
        let start = page - (showpage - 1) ;
        let end = page * 1 + (showpage - 1);
        if (start < 1) {
            start = 1;
            end = start + showpage - 1;
        }
        if (end > data.totalpage) {
            end = data.totalpage;
            start = end - showpage + 1;
            if (start < 1) {
                start = 1;
            }
        }
        data.start = start;
        data.end = end;
        res.render('admin/tealist', data);
    });
})
// 教师删除
router.get('/deltea', (req, res) => {
    let sid = req.query.sid;
    let sql = 'UPDATE teacher SET t_status = 0 WHERE t_account = ?';
    conn.query(sql, sid, (err, result) => {
        res.json({
            result: 'ok'
        });
    });
});
//教师搜索
router.get("/tea_seach", (req, res) => {
    res.render('admin/tea_seach');
})
router.post("/tea_seach", (req, res) => {
    let d = req.body;
    console.log(d)
    let sql = "SELECT * FROM teacher where t_account=? and t_status=1"
    conn.query(sql, d.t_account, (err, result) => {
        console.log(result)
        if (!result.length) {
            res.json({ r: 't_account_not_exit' });
            console.log("账号不存在")
            return;
        }
        // console.log(data)
        res.json({ r: 'ok', result: result });
    })
})
//学生管理页面
router.get("/stu", (req, res) => {
    let pagenum = 8;
    let page = req.query.page ? req.query.page : 1;
    (page < 1) && (page = 1);
    async.series({
        totalnums: function (cb) {
            let sql = 'SELECT COUNT(s_id) AS totalnums FROM students';
            conn.query(sql, (err, result) => {
                 totalpage = Math.ceil(result[0].totalnums / pagenum);
                 console.log(totalpage)
                if (page > totalpage) {
                    page = totalpage;
                }
                cb(null, result.totalnums);
            });
        },
        lists: function (cb) {
            let sql = 'SELECT * from students where s_status=1 LIMIT ?, ?';
            conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
                cb(null, results);
            });
        }
    }, (err, data) => {
        data.page = page;
        data.totalpage = Math.ceil(data.totalnums / pagenum);
        if (totalpage < 5) {
            showpage =totalpage;
        }else{
             showpage =5;
        }
        let start = page - (showpage - 1) ;
        let end = page * 1 + (showpage - 1);
        if (start < 1) {
            start = 1;
            end = start + showpage - 1;
        }
        if (end > data.totalpage) {
            end = data.totalpage;
            start = end - showpage + 1;
            if (start < 1) {
                start = 1;
            }
        }
        data.start = start;
        data.end = end;
        res.render('admin/stu', data);
    });
})
//删除学生
router.get('/delstu', (req, res) => {
    let sid = req.query.sid;
    console.log(sid)
    let sql = 'UPDATE students SET s_status = 0 WHERE s_account = ?';
    conn.query(sql, sid, (err, result) => {
        res.json({
            result: 'ok'
        });
    });
});
//添加学生
router.get("/addstu", (req, res) => {
    let data = {};
    data.username = req.session.username;
    async.series({
        lists: function (callback) {
            let sql = 'SELECT * from class where c_status=1';
            conn.query(sql, (err, result) => {
                console.log(result)
                callback(null, result);
            });
        }
    }, (err, result) => {
        data.lists = result.lists;
        data.tealist = result.tealist;
        console.log(data)
        res.render("admin/addstu", data)
    });
})
router.post("/addstu", (req, res) => {
    let d = req.body;
    console.log(d)
    let sql = "SELECT * FROM students where s_account=?"
    conn.query(sql, d.s_account, (err, result) => {
        console.log(result)
        if (result.length) {
            res.json({ r: 'stu_exit' });
            console.log("账号存在")
            return;
        }
        let sqll = 'INSERT INTO students(s_account, s_name, s_password,s_class,s_sex,s_times) VALUES (?,?,?,?,?,?)'
        conn.query(sqll, [d.s_account, d.s_name, d.s_password, d.s_class, d.s_sex,new Date().toLocaleString()], (err, result) => {
            res.json({ r: 'ok' });
        })
    })
})
//学生搜索
router.get("/stu_seach", (req, res) => {
    res.render('admin/stu_seach');
})
router.post("/stu_seach", (req, res) => {
    let d = req.body;
    console.log(d)
    let sql = "SELECT * FROM students where s_account=? and s_status=1"
    conn.query(sql, d.s_account, (err, result) => {
        console.log(result)
        if (!result.length) {
            res.json({ r: 's_account_not_exit' });
            console.log("账号不存在")
            return;
        }
        res.json({ r: 'ok', result: result });
    })
})
//课程管理页面
router.get("/course", (req, res) => {
    let data = {};
    data.username = req.session.username;
    async.series({
        lists: function (callback) {
            let sql = 'SELECT * from class where c_status=1';
            conn.query(sql, (err, result) => {
                console.log(result)
                callback(null, result);
            });
        },
        tealist: function (callback) {
            let sql = 'SELECT * from teacher where t_status=1';
            conn.query(sql, (err, result) => {
                console.log(result)
                callback(null, result);
            });
        }
    }, (err, result) => {
        data.lists = result.lists;
        data.tealist = result.tealist;
        console.log(data)
        res.render("admin/course", data)
    });
})
//课程添加
router.post("/course", (req, ress) => {
    let d = req.body;
    console.log(d)
    let sql = "SELECT * FROM curricuium where c_time=? and c_class=?"
    conn.query(sql,  [d.c_time,d.c_class], (err, result) => {
        console.log(result)
        if (result.length) {
            ress.json({ r: 'course_exit' });
            console.log("该时间段已有课程")
            return;
        }
        let sqll = 'INSERT INTO curricuium (c_class,c_name,c_account,c_time,c_start,c_end,c_addr) VALUES (?,?,?,?,?,?,?)'
        conn.query(sqll, [d.c_class, d.c_name, d.c_account, d.c_time, d.c_start, d.c_end, d.c_addr], (err, result) => {
            ress.json({ r: 'ok' });
        })
    })
})
//课程列表
router.get("/cour_list", (req, res) => {
    let pagenum = 8;
    let page = req.query.page ? req.query.page : 1;
    (page < 1) && (page = 1);
    async.series({
        totalnums: function (cb) {
            let sql = 'SELECT COUNT(c_id) AS totalnums FROM curricuium';
            conn.query(sql, (err, result) => {
                 totalpage = Math.ceil(result[0].totalnums / pagenum);
                 console.log(totalpage)
                if (page > totalpage) {
                    page = totalpage;
                }
                cb(null, result.totalnums);
            });
        },
        lists: function (cb) {
            let sql = 'SELECT * from curricuium where c_status=1 LIMIT ?, ?';
            conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
                cb(null, results);
            });
        }
    }, (err, data) => {
        data.page = page;
        data.totalpage = Math.ceil(data.totalnums / pagenum);
        if (totalpage < 5) {
            showpage =totalpage;
        }else{
             showpage =5;
        }
        let start = page - (showpage - 1);
        let end = page * 1 + (showpage - 1);
        if (start < 1) {
            start = 1;
            end = start + showpage - 1;
        }
        if (end > data.totalpage) {
            end = data.totalpage;
            start = end - showpage + 1;
            if (start < 1) {
                start = 1;
            }
        }
        data.start = start;
        data.end = end;
        res.render('admin/cour_list', data);
    });

})
//课程删除
router.get('/delcour', (req, res) => {
    let sid = req.query.sid;
    let sql = 'UPDATE curricuium SET c_status = 0 WHERE c_class = ?';
    conn.query(sql, sid, (err, result) => {
        res.json({
            result: 'ok'
        });
    });
});
//课程搜索
router.get("/cour_seach", (req, res) => {
    res.render('admin/cour_seach');
})
router.post("/cour_seach", (req, res) => {
    let d = req.body;
    console.log(d)
    let sql = "SELECT * FROM curricuium where c_class=?and c_status=1"
    conn.query(sql, d.c_class, (err, result) => {
        console.log(result)
        if (!result.length) {
            res.json({ r: 'c_class_not_exit' });
            console.log("账号不存在")
            return;
        }
        res.json({ r: 'ok', result: result });
    })
})
//公告管理页面
router.get("/announ", (req, res) => {
    let data = {};
    data.username = req.session.username;
    async.series({
        lists: function (callback) {
            let sql = 'SELECT * from class where c_status=1';
            conn.query(sql, (err, result) => {
                console.log(result)
                callback(null, result);
            });
        }
    }, (err, result) => {
        data.lists = result.lists;
        console.log(data)
        res.render("admin/announ", data)
    });
})
//发布公告
router.post("/announ", (req, res) => {
    let d = req.body;
    console.log(d);
    let sqll = 'INSERT INTO notice (n_class,n_title,n_content,n_name,n_time,n_account) VALUES (?,?,?,?,?,?)'
    conn.query(sqll, [d.n_class, d.n_title, d.n_content, req.session.username, new Date().toLocaleString(), req.session.aid], (err, result) => {
        res.json({ r: 'ok' });
    })
})
//公告列表
router.get("/announ_list", (req, res) => {
    let pagenum = 5;
    let page = req.query.page ? req.query.page : 1;
    (page < 1) && (page = 1);
    async.series({
        totalnums: function (cb) {
            let sql = 'SELECT COUNT(n_id) AS totalnums FROM notice';
            conn.query(sql, (err, result) => {
                 totalpage = Math.ceil(result[0].totalnums / pagenum);
                 console.log(totalpage)
                if (page > totalpage) {
                    page = totalpage;
                }
                cb(null, result.totalnums);
            });
        },
        lists: function (cb) {
            let sql = 'SELECT * from notice LIMIT ?, ?';
            conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
                cb(null, results);
            });
        }
    }, (err, data) => {
        data.page = page;
        data.totalpage = Math.ceil(data.totalnums / pagenum);
        if (totalpage < 5) {
            showpage =totalpage;
        }else{
             showpage =5;
        }
        let start = page - (showpage - 1);
        let end = page * 1 + (showpage - 1);
        if (start < 1) {
            start = 1;
            end = start + showpage - 1;
        }
        if (end > data.totalpage) {
            end = data.totalpage;
            start = end - showpage + 1;
            if (start < 1) {
                start = 1;
            }
        }
        data.start = start;
        data.end = end;
        res.render('admin/announ_list', data);
    });

})
//班级管理
router.get("/class", (req, res) => {
    res.render("admin/class")
})
//添加班级
router.post("/class", (req, res) => {
    let d = req.body;
    console.log(d)
    let sql = "SELECT * FROM class where c_class=?"
    conn.query(sql, d.clas, (err, result) => {
        console.log(result)
        if (result.length) {
            res.json({ r: 'class_exit' });
            console.log("账号存在")
            return;
        }
        let sqll = 'INSERT INTO class(c_class, c_specialty) VALUES (?,?)'
        conn.query(sqll, [d.clas, d.specialty], (err, result) => {
            res.json({ r: 'ok' });
        })
    })
})
//班级列表
router.get("/clalist", (req, res) => {
    let pagenum =8;
    let page = req.query.page ? req.query.page : 1;
    (page < 1) && (page = 1);
    async.series({
        totalnums: function (cb) {
            let sql = 'SELECT COUNT(c_id) AS totalnums FROM class';
            conn.query(sql, (err, result) => {
                 totalpage = Math.ceil(result[0].totalnums / pagenum);
                 console.log(totalpage)
                if (page > totalpage) {
                    page = totalpage;
                }
                cb(null, result.totalnums);
            });
        },
        lists: function (cb) {
            let sql = 'SELECT * from class where c_status=1 LIMIT ?, ?';
            conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
                cb(null, results);
            });
        }
    }, (err, data) => {
        data.page = page;
        data.totalpage = Math.ceil(data.totalnums / pagenum);
        if (totalpage < 5) {
            showpage =totalpage;
        }else{
             showpage =5;
        }
        let start = page - (showpage - 1);
        let end = page * 1 + (showpage - 1);
        if (start < 1) {
            start = 1;
            end = start + showpage - 1;
        }
        if (end > data.totalpage) {
            end = data.totalpage;
            start = end - showpage + 1;
            if (start < 1) {
                start = 1;
            }
        }
        data.start = start;
        data.end = end;
        res.render('admin/clalist', data);
    });
})
//班级删除
router.get('/delcla', (req, res) => {
    let sid = req.query.sid;
    let sql = 'UPDATE class SET c_status = 0 WHERE c_class = ?';
    conn.query(sql, sid, (err, result) => {
        res.json({
            result: 'ok'
        });
    });
});
module.exports = router;