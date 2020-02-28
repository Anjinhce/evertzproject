var express = require('express');
var router = express.Router();
var multer = require('multer');
const mysql=require("mysql")



var storage = multer.diskStorage({
destination:function(req,file,cb){
    cb(null,'upload/')
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

router.get('/create',function(req,res,next){

    res.render('create',{title : 'Create Blog'});
})


router.post('/upload',upload.single('blogimage'),function(req,res,next){
    var fileinfo=req.file.filename;
    var tdata = req.body;
   // console.log(tdata);

mysqlConnection.query("select employee.ID from employee where EMP_id='"+tdata.employee_id+"'",function(err,result){
if(err) throw err

else{
    var sql ="INSERT INTO travel_history(EMP_ID,FROM_DATE,TO_DATE,DEPATURE_ID,DESTINATION_ID,TRAVEL_TYPE_ID,CUSTOMER_ID,FLIGHT_DETAILS_PATH) VALUES('"+result[0].ID+"','"+tdata.from_date+"','"+tdata.to_date+"','"+tdata.depature_id+"','"+tdata.destination_id+"','"+tdata.travel_type_id+"','"+tdata.customer_id+"','"+fileinfo+"')";
    mysqlConnection.query(sql,
        function(err){
     if(err){
         throw err
     }
     
     else{

        res.redirect("../secret/travel_display");
       // console.log("Travel recorde Added ");
              
       // var alermsg="Travel Record Inserted Successfully";
    }
 })

}

})
 

})
   
    
module.exports =router;