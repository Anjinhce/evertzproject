var express = require('express');
var app = express.Router();

var multer = require('multer');
const mysql=require("mysql")



var storage = multer.diskStorage({
destination:function(req,file,cb){
    cb(null,'training_doc/')
},
filename:function(req ,file,cb){
    cb(null,Date.now() +file.originalname)
}

})

var mysqlConnection=mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'',
    database: 'evertzemployee'
})

var upload = multer({storage : storage})
// creage blog


app.post('/train_add',upload.single('training_doc'),function(req,res,next){
    var fileinfo=req.file.filename;
    var tdata = req.body;
 mysqlConnection.query("INSERT INTO training(TITLE,VIDEO_PATH,DOCUMENT_PATH) VALUES('"+tdata.training_title+"','"+tdata.video_url+"','"+fileinfo+"')",function(err){
if (err) throw err
else{

    

        res.redirect("../secret/training_display");
}
})
})


module.exports =app;