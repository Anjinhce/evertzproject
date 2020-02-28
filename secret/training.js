var express = require('express');
var app = express.Router();
var fs = require('fs');

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



app.post('/train_update/:id',upload.single('training_doc'),function(req,res,next){

    
    var fileinfo;
    var train_id=req.params.id
    if(typeof(req.file)!='undefined'){
     var fileinfo=req.file.filename;
     delete_id=req.params.id
     console.log(req.file);
     mysqlConnection.query("select * from training where ID='"+delete_id+"'",function(err,resultD){
         if (err) throw err
 else{
 
 
      fs.unlink('training_doc/'+resultD[0].DOCUMENT_PATH, function (err) {
         if (err) throw err;
         // if no error, file has been deleted successfully
         console.log('File deleted!');
     }); 
 }
 
 
     });
 }
 else{
  
 fileinfo=req.body.train_update;
 
 }
    
    
     
     mysqlConnection.query("update training set TITLE='"+req.body.training_title+"', VIDEO_PATH='"+req.body.video_url+"',DOCUMENT_PATH='"+fileinfo+"' where ID='"+train_id+"'",function(err,result)
     {
         if(err)
         {
             throw err
 
         }
         else
         {
             console.log("updated successfully")
             console.log(result);
             res.redirect('/secret/training_display');
           
         }
     })

})


module.exports =app;