const express = require('express');
const async = require('async');
const router = express.Router();


//test
router.get('/',(req,res)=>{
    res.send('ok');
})




module.exports = router;