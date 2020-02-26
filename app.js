const mysql=require("mysql")
const express=require('express')


var multer = require('multer');

var storage = multer.diskStorage({

    destination : function(req,file,cb){
        cb(null,'upload/');
    },
    filename : function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})

var upload = multer({storage : storage})

var fs = require('fs');
const { DownloaderHelper } = require('node-downloader-helper');
var download = require('download-file')
var path=require("path")
var ejs=require('ejs')
const session=require('express-session')
const cookieParser = require('cookie-parser');

const  blogRouter = require('./secret/file');
var app=express();
const port = process.env.PORT || 1915;

const bodyParser=require('body-parser')
app.set('view engine', 'ejs');


var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(session({secret: 'qweasdzxc',saveUninitialized:true, resave: false}))
app.use(cookieParser());
app.use('/blogs',blogRouter);

var dir = path.join(__dirname, 'public');

var authenticate=function(req,res,next)
{
    if(req.session.isAuthenticated || req.cookies['name'])
    {
        return next()
    }
    else
    {
        res.redirect("../login")
    }
}

app.set('views', __dirname + '/views');

app.use(express.static(dir));
app.use('/secret',authenticate, express.static(path.join(__dirname, 'secret')));


var obj={}

const now=new Date()

var page_no=0;

var mysqlConnection=mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'',
    database: 'evertzemployee'
})

app.all("/",function(req,res){
    res.redirect("secret/payroll");
})


app.get('/secret/payroll',function(req,res)
{
    console.log(req.cookies['name'])
    res.render("../secret/payroll");
})

app.get('/fetch_id',function(req,res)
{
    var emp_id=req.query.send_data

  

    mysqlConnection.query("select FIRTS_NAME AS NAME,count(*) as count_emp from employee where EMP_ID='"+emp_id+"'",function(err1,result1){
        if(err1)
        {
            throw err1
        }
        else
        {
            console.log(result1[0])
            if(result1[0].count_emp==0)
            {
                console.log(result1)
                
                res.send("Employee doesn't exist")
                console.log("employee doesn't exist")
            }
            else
            {
                mysqlConnection.query("select count(*) as Count_id from payroll_management  where EMP_ID='"+emp_id+"'",function(err,result)
                {
                    if(err)
                    {
                        throw err
                    }
                    else
                    {
                        if(result[0].Count_id!=0)
                    {
                        res.send("Employee Payroll already exists")
                    }
                    else{
                        res.send(result1[0].NAME)
                    }
                }
            })
            }
        }
    })
})

app.get("/secret/logout",function(req,res)
{
    if(req.session.isAuthenticated || req.cookies['name']==1)
    {
        res.clearCookie('name');
        req.session.destroy(function(err)
        {
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.redirect("../login")
            }
        })
    }
})

app.get('/login',function(req,res)
{
    res.render("login")
})

app.get('/secret/edit-details/:id',function(req,res)
{
    var emp_id=req.params.id;
    mysqlConnection.query("select * from payroll_management where id='"+emp_id+"'",function(err,result)
    {
        if(err)
        {
            throw err
        }
        else
        {
            emp_data={my_data :result}
            res.render('../secret/edit-details',emp_data);
        }
    })
})

app.post('/loginAction',urlencodedParser,function(req,res)
{
    mysqlConnection.query("select id,count(*) AS Count_rows from user where USERNAME='"+req.body.username+"' and PASSWORD='"+req.body.password+"'",function(err,result)
    {
        if(err)
        {
            throw err
        }
        else
        {
            var count_rows=result[0].Count_rows
            if(count_rows!=1)
            {
                req.session.isAuthenticated=false
                res.render('login-fail')
            }
            else
            {
                req.session.isAuthenticated=true
                res.cookie('name', result[0].id, {expire: 36000000 + Date.now()});
                res.redirect('../secret/payroll')
            }
        }
    })
})

app.get('/secret/contact-success', function(req, res) {
    mysqlConnection.query("select * from  payroll_management order by id desc limit 0,10",function(err,result){
        if(err)
        {
            throw err
        }
        else
        {
            obj = {print: result};
            res.render('../secret/contact-success', obj);
        }
    })
  });

app.listen(port,()=> console.log("express server running"))

app.get('/prev',function(req,res)
{
    var new_limit;
    console.log(page_no)
    if(page_no>0)
    {
        page_no=page_no-1;
        new_limit=(page_no*10);
        mysqlConnection.query("select * from payroll_management order by id desc limit "+new_limit+",10",function(err,result)
    {
        if(err)
        {
            throw err
        }
        else
        {
            obj = {print: result};
            console.log(obj);
            res.render('contact-success', obj);
        }
    })
    }
    else
    {
        mysqlConnection.query("select * from payroll_management order by id desc limit 0,10",function(err,result)
    {
        if(err)
        {
            throw err
        }
        else
        {
            obj = {print: result};
            console.log(obj);
            res.render('contact-success', obj);
        }
    })
    }
})

app.get('/next',function(req,res)
{
    var new_limit;
    page_no=page_no+1;
    new_limit=(page_no*10);
        mysqlConnection.query("select * from payroll_management order by id desc limit "+new_limit+",10",function(err,result)
    {
        if(err)
        {
            throw err
        }
        else
        {
            obj = {print: result};
            res.render('contact-success', obj);
        }
    })
})

app.post('/secret/edit-details/modifyDetails/:id',urlencodedParser,function(req,res)
{
    var date_string=now.toString()
    console.log(req.body);
    console.log(date_string)
    var emp_id=req.params.id
    mysqlConnection.query("update payroll_management set TRANSACTION_DATE='"+req.body.date+"', EMP_ID='"+req.body.employee_id+"',BASIC_SALARY='"+req.body.basic_salary+"', HRA='"+req.body.hra+"', SA='"+req.body.sa+"', PROFESSIONA_TAX='"+req.body.professional_tax+"', TAX_DETUCTION_FROM_SORCE='"+req.body.tax_source+"', STANDARD_DETUCTION='"+req.body.standard_deduction+"', OTHERS_DETUCTION='"+req.body.other_deductions+"', NET_AMOUNT='"+req.body.net_amount+"' where ID='"+emp_id+"'",function(err,result)
    {
        if(err)
        {
            throw err
        }
        else
        {
            console.log("updated successfully")
        }
    })
    res.redirect("/secret/contact-success");
})

app.post('/secret/myaction',urlencodedParser,(req,res)=>{
    req.body.date=now.toString()
    mysqlConnection.query("insert into payroll_management (ID, EMP_ID, TRANSACTION_DATE, BASIC_SALARY, HRA, SA, PROFESSIONA_TAX, TAX_DETUCTION_FROM_SORCE, STANDARD_DETUCTION, OTHERS_DETUCTION, NET_AMOUNT) values ('','"+req.body.employee_id+"','"+req.body.date+"','"+req.body.basic_salary+"','"+req.body.hra+"','"+req.body.sa+"','"+req.body.professional_tax+"','"+req.body.tax_source+"','"+req.body.standard_deduction+"','"+req.body.other_deductions+"','"+req.body.net_amount+"')",
    function(err)
    {
        if(err)
        {
            throw err
        }
        else
        {
            console.log('added succesfully')
        }
    })
    res.redirect("../secret/contact-success");
})


// **************************travel starts *****************************************************

app.get('/secret/travel_add', function(req, res) {

   

    mysqlConnection.query("select * from  region",function(err,result){
        if(err)  throw err
       
 mysqlConnection.query("select * from  customer",function(err,result1){
            if(err)throw err
            
mysqlConnection.query("select * from  travel_type",function(err,result2){
                if(err)  throw err
               
        
        else
        {

                
            obj = {print: result,print1 : result1,print2 : result2};
            res.render('../secret/travel_add', obj);
            }
    })
})
    })
  });


  app.get('/secret/travel_display', function(req, res) {

    mysqlConnection.query("select count(*) as tcount from travel_history",function(err,count){
        if(err) throw err
mysqlConnection.query("SELECT travel_history.ID,employee.EMP_ID,employee.FIRTS_NAME,travel_history.FROM_DATE,travel_history.TO_DATE,region.NAME as Depature,region.NAME as Destination,travel_type.NAME as Travel_type,customer.NAME as Customer,travel_history.FLIGHT_DETAILS_PATH as Flight from employee,travel_type,travel_history,region,customer where employee.ID=travel_history.EMP_ID and region.ID=travel_history.DEPATURE_ID and region.ID=travel_history.DEPATURE_ID and travel_type.ID=travel_history.TRAVEL_TYPE_ID and customer.ID=travel_history.CUSTOMER_ID limit 0,10",function(err,result){
        if(err)
        {
            throw err
        }
mysqlConnection.query("SELECT region.NAME as Destination  from employee,travel_history,region,customer where employee.ID=travel_history.EMP_ID and  region.ID=travel_history.DESTINATION_ID limit 0 , 10 ",function(ree,result1){
    if(err) throw err


        else
        {

            totalpage = count[0].tcount;
            
          


            obj = {t_data: result,des : result1 ,status : 'false',tpage : totalpage};
               

            console.log(obj);
            res.render('../secret/travel_display', obj);
        }
    })
})
  });
});

app.post('/secret/travel_edit/update_travel/:id',upload.single('flight'),urlencodedParser,function(req,res,next)
{
      
   var date_string=now.toString()
   var fileinfo;
   var emp_id=req.params.id
   if(typeof(req.file)!='undefined'){
    var fileinfo=req.file.filename;
    delete_id=req.params.id
    mysqlConnection.query("select * from travel_history where ID='"+delete_id+"'",function(err,resultD){
        if (err) throw err
else{


     fs.unlink('upload/'+resultD[0].FLIGHT_DETAILS_PATH, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    }); 
}


    });
}
else{
 
fileinfo=req.body.flight_update;

}
   
   
    
    mysqlConnection.query("update travel_history set FROM_DATE='"+req.body.from_date+"', TO_DATE='"+req.body.to_date+"',DEPATURE_ID='"+req.body.depature_id+"', DESTINATION_ID='"+req.body.destination_id+"', TRAVEL_TYPE_ID='"+req.body.Travel_type+"', customer_id='"+req.body.customer_id+"', flight_details_path='"+fileinfo+"' where ID='"+emp_id+"'",function(err,result)
    {
        if(err)
        {
            throw err

        }
        else
        {
            console.log("updated successfully")
            console.log(result);
            res.redirect('/secret/travel_display');
           // res.render('../secret/travel_display');
        }
    })
  
})

app.get('/secret/travel_delete/:id',function(req,res){

    delete_id=req.params.id
 mysqlConnection.query("select * from travel_history where ID='"+delete_id+"'",function(err,resultD){
     if (err) throw err
   
mysqlConnection.query("DELETE FROM travel_history WHERE ID='"+delete_id+"'",function(err,result){
if(err){
    throw err
}
else{

    
    fs.unlink('upload/'+resultD[0].FLIGHT_DETAILS_PATH, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    }); 
    
    
    console.log("deleted");
    res.redirect("/secret/travel_display");

}

})
}) 

})


app.get('/secret/travel_download/:id',function(req,res){

    file_id=req.params.id
mysqlConnection.query("select * FROM travel_history WHERE ID='"+file_id+"'",function(err,result){
if(err){
    throw err
}
else{

   
   
    res.download('upload/'+result[0].FLIGHT_DETAILS_PATH);

    console.log("dowload complted");
   }
})
})




app.get('/secret/travel_edit/:id',function(req,res)
{
    var emp_id=req.params.id;
    var sql = "SELECT employee.EMP_ID,employee.FIRTS_NAME,travel_history.FROM_DATE,travel_history.TO_DATE,region.NAME as Depature,region.NAME as Destination,region.ID as Depature_id,region.ID as Destination_id,travel_type.NAME as Travel_type,travel_type.ID as Travel_type_id,customer.ID as Customer_id,customer.NAME as Customer,travel_history.FLIGHT_DETAILS_PATH as Flight from employee,travel_type,travel_history,region,customer where travel_history.ID='"+emp_id+"' and region.ID=travel_history.DEPATURE_ID and region.ID=travel_history.DEPATURE_ID and travel_type.ID=travel_history.TRAVEL_TYPE_ID and customer.ID=travel_history.CUSTOMER_ID and employee.ID=travel_history.EMP_ID"
    mysqlConnection.query(sql,function(err,result)
    {
        if(err) throw err
        mysqlConnection.query("select * from  region",function(err,result1){
            if(err)  throw err
           
     mysqlConnection.query("select * from  customer",function(err,result2){
                if(err)throw err
                
    mysqlConnection.query("select * from  travel_type",function(err,result3){
                    if(err)  throw err
     mysqlConnection.query("SELECT region.NAME as Destination  from employee,travel_history,region,customer where travel_history.ID='"+emp_id+"' and employee.ID=travel_history.EMP_ID and  region.ID=travel_history.DESTINATION_ID ",function(ree,result4){
     if(err) throw err
                    else
        {
            console.log(result);
            emp_data={my_data :result, my_id: emp_id,Region : result1,Customer : result2,Travel : result3,des : result4}
           console.log(emp_data);
            res.render('../secret/travel_edit',emp_data);

          
        }
   
})
})
        })
    })
})
});

app.post('/emp_search',urlencodedParser, function(req, res) {

    var emp_id=req.body.emp_id;
    var empty_msg;
   
    mysqlConnection.query("SELECT travel_history.ID,employee.EMP_ID,employee.FIRTS_NAME,travel_history.FROM_DATE,travel_history.TO_DATE,region.NAME as Depature,region.NAME as Destination,travel_type.NAME as Travel_type,customer.NAME as Customer,travel_history.FLIGHT_DETAILS_PATH as Flight from employee,travel_type,travel_history,region,customer where employee.ID=travel_history.EMP_ID and region.ID=travel_history.DEPATURE_ID and region.ID=travel_history.DEPATURE_ID and travel_type.ID=travel_history.TRAVEL_TYPE_ID and customer.ID=travel_history.CUSTOMER_ID and employee.EMP_ID = '"+emp_id+"'",function(err,result){
        if(err)
        {
            throw err
        }
mysqlConnection.query("SELECT region.NAME as Destination  from employee,travel_history,region,customer where employee.ID=travel_history.EMP_ID and  region.ID=travel_history.DESTINATION_ID   and employee.EMP_ID = '"+emp_id+"'",function(ree,result1){
    if(err) throw err


        else
        {
            totalpage = result.length;
           

            obj = {t_data: result,des : result1,status : 'true',tpage : totalpage };
               

            console.log(obj);
            res.render('../secret/travel_display', obj);
        }
    })
})
  
});










//*************************travel end*********************************************************






//**********************************holiday starts **********************************************
  app.get('/secret/holiday', function(req, res) {
mysqlConnection.query("SELECT holiday.ID,holiday.NAME,holiday.DATE,country.NAME  as COUNTRY from holiday,country where holiday.COUNTRY_ID=country.ID",function(err,result){
        if(err)
        {
            throw err
        }
mysqlConnection.query("select * from country",function(err,result1){
if (err) throw err

        else
        {
            obj = {h_data: result,country : result1 ,msg : 'false'};
           
            res.render('../secret/holiday', obj);
        }
    })
})
  });

  app.get('/secret/holiday_add', function(req, res) {
    mysqlConnection.query("SELECT * from country",function(err,result){
        if(err)
        {
            throw err
        }
        else
        {
            obj = {country_data: result};
            res.render('../secret/holiday_add', obj);
        }
    })
  });


  app.post('/holi_add',urlencodedParser,function(req,res){

  var holi_add = req.body;

  mysqlConnection.query("insert into holiday(NAME,DATE,COUNTRY_ID) VALUES('"+holi_add.holiday_name+"','"+holi_add.holiday_date+"','"+holi_add.country_id+"')",function(err){

    if(err){
        throw err
    }
    else{
        console.log("Record Inserted");
        

    }
  })
 
  res.redirect("../secret/holiday");


  })

  



app.get('/secret/holiday_edit/:id',function(req,res)
{
    var holiday_id=req.params.id;
    var sql = "SELECT holiday.ID,holiday.NAME,holiday.DATE,country.ID as country_id,country.NAME as country FROM country,holiday WHERE country.ID=holiday.country_ID and holiday.ID='"+holiday_id+"'";
    mysqlConnection.query(sql,function(err,result)
    {
        if(err){
            throw err;
        }

        mysqlConnection.query("select * from country",function(err,result1)
        {
            if(err){
                throw err;
            }
       
        else
        {
        
            holiday_data={holiday :result,country_data:result1}
           console.log(holiday_data);
            res.render('../secret/holiday_edit',holiday_data);

          
        }
   
})
    })
     
});


app.post('/secret/holiday_edit/holy_edit/:id',urlencodedParser,function(req,res)
{
   
    console.log(req.body);
   
    var holy_id=req.params.id

mysqlConnection.query("update holiday set NAME='"+req.body.holiday_name+"' ,DATE='"+req.body.holiday_date+"' ,COUNTRY_ID='"+req.body.country_id+"'  WHERE ID='"+holy_id+"' ",function(err){

    if(err) throw err
    else
console.log("updated successfully");



})

   
    res.redirect("/secret/holiday");
})

app.get("/secret/holiday_delete/:id",function(req,res){
    var holy_id=req.params.id;

mysqlConnection.query("DELETE FROM  holiday WHERE ID='"+holy_id+"'",function(err){

    if(err) throw err
    else
    console.log("deleted succesfully");
})



    res.redirect("/secret/holiday");

})

//holiday filter
app.post('/holiday_filter',urlencodedParser,function(req,res){

  var filter=req.body.holi_filter;
  if(filter !=''){

    var sql="SELECT holiday.ID,holiday.NAME,holiday.DATE,country.NAME as COUNTRY from holiday,country where holiday.COUNTRY_ID=country.id and holiday.COUNTRY_ID='"+filter+"'";
mysqlConnection.query(sql,function(err,result){
if(err) throw err

mysqlConnection.query("select * from country",function(err,result1){

if(err) throw err
else{

    holiday_data={h_data :result ,country : result1,msg :'true'}
    console.log(holiday_data);
     res.render('../secret/holiday',holiday_data);


}


})
})




  }



});


