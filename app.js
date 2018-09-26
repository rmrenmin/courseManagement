const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const svgCaptcha = require('svg-captcha');
const fs = require('fs');
const path = require('path');

//服务器创建
const app = express();

//定义参数
let secret = 'suibianxiede';
let hostname = 'http://localhost:8081/';
//中间键
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser(secret));

//模板引擎
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', './views');

//数据库
global.conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'coursemanage'
});
conn.connect();

//session
app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 3600 * 1000
    }
}));

//文件上传位置
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 递归创建目录 同步方法
        function mkdirsSync(dirname) {
            if (fs.existsSync(dirname)) {
                return true;
            } else {
                if (mkdirsSync(path.dirname(dirname))) {
                    fs.mkdirSync(dirname);
                    return true;
                }
            }
        }
        mkdirsSync(`./uploads/${new Date().getFullYear()}/${(new Date().getMonth()+1).toString().padStart(2,'0')}`);
        cb(null, `./uploads/${new Date().getFullYear()}/${(new Date().getMonth()+1).toString().padStart(2,'0')}`);
    },
    filename: function (req, file, cb) {
        let filename = new Date().valueOf() + '_' + Math.random().toString().substr(2) + '.' + file.originalname.split(".").pop();
        cb(null, filename);
    }
});

const upload = multer({
    storage: diskStorage
});

//验证码
app.get('/coder', (req, res) => {
    var captcha = svgCaptcha.create({
        size: 1,
        color: true,
        noise: 2,
        ignoreChars: '0o1il',
        background: "#cc9966"
    });
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});

//上传图片接口
app.post('/uploads', upload.array('images'), (req, res) => {
    let data = [];
    for (const ad of req.files) {
        let path = hostname + ad.path.replace(/\\/g, '/');
        data.push(path);
    }
    res.json({
        'errno': 0,
        'data': data
    });
});

//首页
app.use('/index', (req,res)=>{
    res.redirect('/students/login.html');
});
//子路由
//管理员
// app.use('/admin/login',require('./module/admin/login'));
app.use('/admin', require('./module/admin/index'));
//教师用户
app.use('/teacher',require('./module/teacher/'));
app.use('/teacher/login',require('./module/teacher/login'));
//学生
app.use('/', require('./module/students/'));

//test

//静态托管
app.use(express.static('static'));
app.use('/uploads',express.static('uploads'));

//端口
app.listen('8081', function () {
    console.log('服务器启动成功');
});