const fs = require('fs');

module.exports = {
    addUserPage: (req, res) => {
        mysqlConnection.query("select * from designation",function(err,result)
        {
            if(err)
            {
                throw err
            }
            else
            {
                mysqlConnection.query("select * from gender",function(err1,result1)
                {
                    if(err1)
                    {
                        throw err1
                    }
                    else
                    {
                        mysqlConnection.query("select * from country",function(err2,result2)
                        {
                            if(err2)
                            {
                                throw err2
                            }
                            else
                            {
                                res.render('../secret/add-user.ejs', {
                                    print: result,
                                    print1: result1,
                                    print2: result2
                                });
                            }
                        })
                    }
                })
            }
        })
    },
    addUser: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let emp_id = req.body.employee_id;
        let first_name = req.body.first_name;
        let middle_name = req.body.middle_name;
        let last_name = req.body.last_name;
        let designation = req.body.designation;
        let gender = req.body.gender;
        let dateofbirth = req.body.dob;
        let dateofjoining = req.body.doj;
        let reporting_to = req.body.reporting_to;
        let personal_email=req.body.p_email;
        let work_email=req.body.w_email;
        let personal_phone=req.body.p_phone;
        let work_phone=req.body.w_phone;
        let country=req.body.country
        let uploadedFile = req.files.photo;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = first_name +'_'+emp_id+'.'+ fileExtension;

        let empQuery = "SELECT * FROM employee WHERE EMP_ID = '" + emp_id + "'";

        mysqlConnection.query(empQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Employee already exists';
                res.render('add-player.ejs', {
                    message,
                    title: "Evertz | Add"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        console.log(dateofbirth+" "+dateofjoining);
                        let query = "INSERT INTO employee (ID, EMP_ID, FIRTS_NAME, MIDDLE_NAME, LAST_NAME, DATE_OF_BIRTH, DATE_OF_JOIN, DESIGNATION_ID, GENDER_ID, REPORTING_TO_ID, P_EMAIL, W_EMAIL, P_PHONE, W_PHONE, PHOTO_PATH, COUNTRY_ID) VALUES ('','" +
                            emp_id + "', '" + first_name + "', '" + middle_name + "', '" + last_name + "', '" + dateofbirth + "', '" + dateofjoining + "','" + designation + "','" + gender + "','"+reporting_to+"','"+personal_email+"','"+work_email+"','"+personal_phone+"','"+work_phone+"','"+image_name+"','"+country+"')";
                        mysqlConnection.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                                res.redirect('../secret/add-education/'+emp_id);
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-player.ejs', {
                        message,
                        title: "Evertz | Add"
                    });
                }
            }
        });
    },
    edit_personal_details: (req,res) => {
        let emp_id=req.params.id
        res.redirect('../../secret/edit-user/'+emp_id);
    },
    edit_personal_details_page : (req,res) => {
        let emp_id=req.params.id
        mysqlConnection.query("select * from employee where ID='"+emp_id+"'",function(err,result)
        {
            if(err)
            {
                throw err
            }
            else
            {
                mysqlConnection.query("select * from designation;select * from gender; select * from country",function(err1,result1)
                {
                    if(err1)
                    {
                        throw err1
                    }
                    else
                    {
                        console.log(result1);
                        res.render('../secret/edit-user',{my_id: emp_id,print : result,print1 : result1[0], print2 : result1[1], print3 : result1[2]});
                    }
                })
            }
        })
    },
    updateUser:(req,res) => {
        let store_id=req.params.id
        let emp_id=req.body.employee_id
        let first_name=req.body.first_name
        let middle_name=req.body.middle_name
        let last_name=req.body.last_name
        let dob=req.body.dob
        let doj=req.body.doj
        let designation=req.body.designation
        let gender=req.body.gender
        let reporting_to=req.body.reporting_to
        let p_email=req.body.p_email
        let w_email=req.body.w_email
        let p_phone=req.body.p_phone
        let w_phone=req.body.w_phone
        let country=req.body.country
        let uploadedFile = req.files.photo;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = first_name +'_'+emp_id+'_updated'+'.'+ fileExtension;
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
            uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                // send the player's details to the database
                let query = "update employee set EMP_ID='"+emp_id+"', FIRTS_NAME='"+first_name+"', MIDDLE_NAME='"+middle_name+"', LAST_NAME='"+last_name+"', DATE_OF_BIRTH='"+dob+"', DATE_OF_JOIN='"+doj+"', DESIGNATION_ID='"+designation+"', GENDER_ID='"+gender+"', REPORTING_TO_ID='"+reporting_to+"', P_EMAIL='"+p_email+"', W_EMAIL='"+w_email+"', P_PHONE='"+p_phone+"', W_PHONE='"+w_phone+"', PHOTO_PATH='"+image_name+"', COUNTRY_ID='"+country+"' where ID='"+store_id+"'";
                mysqlConnection.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                        res.redirect('../../secret/create-user/'+emp_id);
                });
            });
        } else {
            message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            res.render('add-player.ejs', {
                message,
                title: "Evertz | Add"
            });
        }
    },
    addEducation: (req,res) => {
        let emp_id=req.params.id;
        var print,print1,print2;
        mysqlConnection.query("select * from edu_branch",function(err,result)
        {
            if(err)
            {
                throw err
            }
            else
            {
                mysqlConnection.query("select * from edu_type",function(err1,result1)
                {
                    if(err1)
                    {
                        throw err1
                    }
                    else
                    {
                        mysqlConnection.query("select * from grades",function(err2,result2)
                        {
                            if(err2)
                            {
                                throw err2
                            }
                            else
                            {
                                res.render('../secret/add-education',{user_id: emp_id,print: result, print1:result1,print2: result2});
                            }
                        })
                    }
                })
            }
        })
    },
    add_education_details:(req,res) => {
        let emp_id=req.body.emp_id;
        let count_education=req.body.count_education;
        mysqlConnection.query("select ID from employee where EMP_ID='"+emp_id+"'",function(err,result)
        {
            if(err)
            {
                throw err
            }
            else
            {
                var j=0;
                for(var i=0;i<=count_education;i++)
                {
                    let education_type=req.body['education_type'+i];
                    let education_branch=req.body['education_branch'+i];
                    let education_grade=req.body['education_grade'+i];
                    let percentage=req.body['percentage'+i];
                    mysqlConnection.query("insert into education_details (ID, EMP_ID, PERCENTAGE, TYPE_ID, GRADE_ID, BRANCH_ID) values ('','"+result[0].ID+"','"+percentage+"','"+education_type+"','"+education_grade+"','"+education_branch+"')",function(err,result1)
                    {
                        if(err)
                    {
                        throw err
                    }
                    else
                    {
                        j++;
                        if((j-1)==count_education)
                        {
                        
                        console.log(count_education+" "+j);
                        res.redirect('../secret/add-bank/'+emp_id);
                        }
                    }
                    })
                }
            }
        })
    },
    edit_education_details:(req,res) => {
        let edu_id=req.params.id
        let emp_id=req.params.emp_id
        res.redirect('../../../secret/edit-education/'+edu_id+'/'+emp_id);
    },
    edit_education:(req,res) => {
        let edu_id=req.params.id
        let emp_id=req.params.emp_id
        mysqlConnection.query("select education_details.ID,education_details.EMP_ID,education_details.PERCENTAGE, education_details.TYPE_ID, education_details.GRADE_ID, education_details.BRANCH_ID,edu_branch.NAME as branch_name, edu_type.NAME as type_name, grades.NAME as grades_name, employee.EMP_ID as employee_id from education_details,employee,edu_branch, edu_type, grades where education_details.ID='"+edu_id+"' AND edu_branch.ID=education_details.BRANCH_ID AND employee.ID='"+emp_id+"' AND edu_type.ID=education_details.TYPE_ID AND grades.ID=education_details.GRADE_ID",function(err,result){
            if(err)
            {
                throw err
            }
            else
            {
                mysqlConnection.query("select * from edu_branch;select * from edu_type; select * from grades",function(err1,result1)
                {
                    if(err1)
                    {
                        throw err1
                    }
                    else
                    {
                        res.render('../secret/edit-education',{print: result, print1: result1[0], print2: result1[1], print3: result1[2], user_id: emp_id})
                    }
                })
            }
        })
    },
    updateEducation : (req,res) => {
        let edu_id=req.params.edu_id;
        let percentage=req.body.percentage;
        let edu_type=req.body.education_type;
        let edu_branch=req.body.education_branch;
        let edu_grade=req.body.education_grade;
        let emp_id=req.body.emp_id;
        mysqlConnection.query("update education_details set PERCENTAGE='"+percentage+"', TYPE_ID='"+edu_type+"', GRADE_ID='"+edu_grade+"', BRANCH_ID='"+edu_branch+"' where ID='"+edu_id+"'",function(err){
            if(err)
            {
                throw err;
            }       
            else
            {
                res.redirect('../../secret/create-user/'+emp_id);
            }
        })
    },
    addBank:(req,res) => {
        let emp_id=req.params.id;
        res.render('../secret/add-bank',{user_id: emp_id});
    },
    add_bank_details: (req,res) => {
        let emp_id=req.body.emp_id
        let count_experience=req.body.count_experience;
        mysqlConnection.query("select ID from employee where EMP_ID='"+emp_id+"'",function(err,result)
        {
            if(err)
            {
                throw err
            }
            else
            {
                let store_id=result[0].ID
                let account_holder_name=req.body.account_name
                let account_no=req.body.account_no
                let ifsc=req.body.ifsc
                let bank_name=req.body.bank_name
                let branch_name=req.body.branch_name
                let swift_code=req.body.swift_code
                mysqlConnection.query("insert into employee_bank (ID, EMP_ID, ACC_HOLD_NAME, ACC_NO, IFSC_CODE, BANK_NAME, BRANCH_NAME, SWIFT_CODE) values ('','"+store_id+"','"+account_holder_name+"','"+account_no+"','"+ifsc+"','"+bank_name+"','"+branch_name+"','"+swift_code+"')",function(err,result1)
                {
                    if(err)
                    {
                        throw err
                    }
                    else
                    {
                        console.log("data added")
                        res.redirect('../secret/add-experience/'+emp_id);
                    }
                })
            }
        })
    },
    edit_bank_details:(req,res) => {
        let emp_id=req.params.id
        res.redirect('../../../secret/edit-bank/'+emp_id);
    },
    edit_bank:(req,res) => {
        let emp_id=req.params.id
        mysqlConnection.query("select employee.EMP_ID as e_id,employee_bank.EMP_ID,employee_bank.ACC_HOLD_NAME, employee_bank.ACC_NO, employee_bank.IFSC_CODE, employee_bank.BANK_NAME,employee_bank.BRANCH_NAME, employee_bank.SWIFT_CODE from employee,employee_bank where employee.ID='"+emp_id+"' AND employee_bank.EMP_ID='"+emp_id+"'",function(err,result)
        {
            if(err)
            {
                throw err
            }
            else
            {
                res.render('../secret/edit-bank',{print: result})
                console.log(result);
            }
        })
    },
    updateBank:(req, res) => {
        let id=req.params.id
        let account_name=req.body.account_name
        let account_no=req.body.account_no
        let ifsc=req.body.ifsc
        let bank_name=req.body.bank_name
        let branch_name=req.body.branch_name
        let swift_code=req.body.swift_code
        let emp_id=req.body.emp_id
        mysqlConnection.query("update employee_bank set ACC_HOLD_NAME='"+account_name+"',ACC_NO='"+account_no+"',IFSC_CODE='"+ifsc+"', BANK_NAME='"+bank_name+"',BRANCH_NAME='"+branch_name+"', SWIFT_CODE='"+swift_code+"' where EMP_ID='"+id+"'",function(err)
        {
            if(err)
            {
                throw err
            }
            else
            {
                res.redirect('../../secret/create-user/'+emp_id);
            }
        })
    },
    addExperience: (req,res) => {
        let emp_id=req.params.id;
        res.render('../secret/add-experience',{user_id: emp_id});
    },
    add_experience_details: (req,res) => {
        let emp_id=req.body.emp_id
        let count_experience=req.body.count_experience
        mysqlConnection.query("select ID from employee where EMP_ID='"+emp_id+"'",function(err,result)
        {
            if(err)
            {
                throw err
            }
            else
            {
                var j=0;
                for(var i=0;i<=count_experience;i++)
                {

                    if (!req.files) {
                        return res.status(400).send("No files were uploaded.");
                    }
                    else
                    {
                        let store_id=result[0].ID
                        let company_name=req.body['company_name'+i]
                        let designation=req.body['designation'+i]
                        let from_date=req.body['from'+i]
                        let to_date=req.body['to'+i]
                        let uploadedFile = req.files['photo'+i];
                        let image_name = uploadedFile.name;
                        let fileExtension = uploadedFile.mimetype.split('/')[1];
                        image_name = emp_id+'_'+company_name+'.'+ fileExtension;
                        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif')
                        {
                            uploadedFile.mv(`public/assets/experience-cert/${image_name}`,function(err)
                            {
                                if(err)
                                {
                                    throw err
                                }
                                else
                                {
                                    mysqlConnection.query("insert into experience (ID, EMP_ID, COMPANY_NAME, DESIGNATION, FROM_DATE, TO_DATE, EXP_CERTIFICATE_PATH) values ('','"+store_id+"','"+company_name+"','"+designation+"','"+from_date+"','"+to_date+"','"+image_name+"')",function(err,result1)
                                    {
                                        if(err)
                                        {
                                            throw err
                                        }
                                        else
                                        {
                                            j++
                                            if((j-1)==count_experience)
                                            {
                                                let username = "evertz_"+emp_id
                                                let password = Math.random().toString(36).substring(7);
                                                let date_of_creation=new Date();
                                                let last_login=new Date();
                                                console.log(username)
                                                mysqlConnection.query("insert into user (ID, EMP_ID, USERNAME, PASSWORD, DATE_OF_CREATION, LAST_LOGIN, IS_ACTIVE) values ('','"+store_id+"','"+username+"','"+password+"','"+date_of_creation+"','"+last_login+"','1')",function(err)
                                                {
                                                    if(err)
                                                    {
                                                        throw err
                                                    }
                                                    else
                                                    {
                                                        res.redirect('../secret/create-user/'+emp_id);
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
            }
        })
    },
    edit_experience_details:(req,res) => {
        let exp_id=req.params.id
        let emp_id=req.params.emp_id
        res.redirect('../../../../secret/edit-experience/'+exp_id+'/'+emp_id);
    },
    edit_experience:(req,res) => {
        let exp_id=req.params.id
        let emp_id=req.params.emp_id
        mysqlConnection.query("select employee.EMP_ID as e_id,employee.ID as emp_id,experience.ID,experience.COMPANY_NAME,experience.DESIGNATION,experience.FROM_DATE,experience.TO_DATE,experience.EXP_CERTIFICATE_PATH from employee,experience where employee.ID='"+emp_id+"' AND experience.ID='"+exp_id+"'",function(err,result)
        {
            if(err)
            {
                throw err
            }
            else
            {
                res.render('../secret/edit-experience',{print: result})
            }
        })
    },
    updateExperience:(req,res) => {
        let emp_id=req.body.emp_id
        let exp_id=req.params.id
        let company_name=req.body.company_name
        let designation=req.body.designation
        let from=req.body.from
        let to=req.body.to
        let uploadedFile = req.files.file;
        let file_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        file_name = emp_id+'_'+company_name+'.'+ fileExtension;
        if (uploadedFile.mimetype === 'text/plain' || uploadedFile.mimetype === 'application/pdf')
        {
            uploadedFile.mv(`public/assets/experience-cert/${file_name}`,function(err)
            {
                if(err)
                {
                    throw err
                }
                else
                {
                    mysqlConnection.query("update experience set COMPANY_NAME='"+company_name+"', DESIGNATION='"+designation+"', FROM_DATE='"+from+"', TO_DATE='"+to+"', EXP_CERTIFICATE_PATH='"+file_name+"' where ID='"+exp_id+"'",function(err)
                    {
                        if(err)
                        {
                            throw err
                        }
                        else
                        {
                            res.redirect('../../../secret/create-user/'+emp_id);
                        }
                    })
                }
            })
        }
    },
    createUser: (req,res) => {
        let emp_id=req.params.id
        mysqlConnection.query("select employee.ID,employee.EMP_ID, employee.FIRTS_NAME, employee.MIDDLE_NAME, employee.LAST_NAME, employee.DATE_OF_BIRTH, employee.DATE_OF_JOIN, employee.DESIGNATION_ID, employee.GENDER_ID, employee.REPORTING_TO_ID, employee.P_EMAIL, employee.W_EMAIL, employee.P_PHONE, employee.W_PHONE, employee.PHOTO_PATH, employee.COUNTRY_ID, designation.DESIGNATION, gender.GENDER, country.NAME as country_name  from employee, designation, gender, country where employee.EMP_ID='"+emp_id+"' and designation.ID=employee.DESIGNATION_ID and gender.ID=employee.GENDER_ID and country.ID=employee.COUNTRY_ID",function(err,result)
        {
            if(err)
            {
                throw err
            }
            else
            {
                let store_id=result[0].ID
                mysqlConnection.query("select USERNAME,PASSWORD from user where EMP_ID='"+store_id+"'",function(err,result1)
                {
                    if(err)
                    {
                        throw err
                    }
                    else
                    {
                        mysqlConnection.query("select education_details.ID,education_details.PERCENTAGE, education_details.TYPE_ID, education_details.GRADE_ID, education_details.BRANCH_ID, edu_type.NAME as edu_type_name, edu_branch.NAME as edu_branch_name, grades.NAME as edu_grade_name from education_details,edu_branch,edu_type,grades where EMP_ID='"+store_id+"' and edu_type.ID=education_details.TYPE_ID and edu_branch.ID=education_details.BRANCH_ID and grades.ID=education_details.GRADE_ID",function(err,result2)
                        {
                            if(err)
                            {
                                throw err
                            }
                            else
                            {
                                
                                mysqlConnection.query("select * from employee_bank where EMP_ID='"+store_id+"'",function(err,result3)
                                        {
                                            if(err)
                                        {
                                            throw err
                                        }
                                        else
                                        {
                                            mysqlConnection.query("select * from experience where EMP_ID='"+store_id+"'",function(err,result4)
                                            {
                                                if(err)
                                                {
                                                    throw err
                                                }
                                                else
                                                {
                                                    var obj={print:result, print1: result1, print2: result2, print3: result3, print4: result4}
                                                res.render("../secret/create-user",obj)
                                                }
                                            })
                                        }
                                        })
                            }
                        })
                    }
                })
            }
        })
    },
    editPlayerPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `employee` WHERE id = '" + playerId + "' ";
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-player.ejs', {
                title: "Edit",
                player: result[0],
                message: ''
            });
        });
    },
    editPlayer: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let dateofbirth = req.body.date_of_birth;
        let dateofjoining = req.body.date_of_joining;
        let number = req.body.number;

        let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "', `date_of_birth` = '" + dateofbirth + "', `date_of_joining` = '" + dateofjoining + "' WHERE `players`.`id` = '" + playerId + "'";
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePlayer: (req, res) => {
        let playerId = req.params.id;
       // let getImageQuery = 'SELECT PHOTO_PATH from employee WHERE id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM employee WHERE employee.ID = "' + playerId + '"';

        // mysqlConnection.query(getImageQuery, (err, result) => {
        //     if (err) {
        //         return res.status(500).send(err);
        //     }

            // let image = result[0].image;

            // fs.unlink(`public/assets/img/${image}`, (err) => {
            //     if (err) {
            //         return res.status(500).send(err);
            //     }
            //     mysqlConnection.query(deleteUserQuery, (err, result) => {
            //         if (err) {
            //             return res.status(500).send(err);
            //         }
            //         res.redirect('/');
            //     });
            // });
        
    },
    viewEmployeePage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('view-profile.ejs', {
                title: "View Profile",
                player: result[0],
                message: ''
            });
        });
    },
    viewEmployee: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let username = req.body.username;
        let position = req.body.position;
        let dateofbirth = req.body.date_of_birth;
        let dateofjoining = req.body.date_of_joining;
        let number = req.body.number;
        let working_email = req.body.WORKING_EMAIL;
        let personal_email = req.body.PERSONAL_EMAIL;
        let country = req.body.COUNTRY_ID;
        let account_holder_name = req.body.account_holder_name;
        let account_number = req.body.account_number;
        let ifsc_code = req.body.ifsc_code;
        let bank_name = req.body.bank_name;
        let branch_name = req.body.branch_name;
        let swift_code = req.body.swift_code;

        // let uploadedFile = req.files.image;
        // let image_name = uploadedFile.name;
        // let fileExtension = uploadedFile.mimetype.split('/')[1];
        // image_name = username + '.' + fileExtension;


        // check the filetype before uploading it
        // if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
        // upload the file to the /public/assets/img directory
        // uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
        //     if (err) {
        //         return res.status(500).send(err);
        //     }
        //     let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "',`image` = '" + image_name + "', `position` = '" + position + "', `number` = '" + number + "', `date_of_birth` = '" + dateofbirth + "', `date_of_joining` = '" + dateofjoining + "' WHERE `players`.`id` = '" + playerId + "'";
        //     mysqlConnection.query(query, (err, result) => {
        //         if (err) {
        //             return res.status(500).send(err);
        //         }
        //         res.redirect('/view/' + playerId);
        //     });
        // });
        // } else {
        //     message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
        //     res.render('add-player.ejs', {
        //         message,
        //         title: "Evertz | View"
        //     });
        // }
        let query = "UPDATE `players` SET  `position` = '" + position + "', `ACC_HOLD_NAME` = '" + account_holder_name + "', `ACC_NO` = '" + account_number + "', `IFSC_CODE` = '" + ifsc_code + "', `BANK_NAME` = '" + bank_name + "', `BRANCH_NAME` = '" + branch_name + "', `SWIFT_CODE` = '" + swift_code + "', `number` = '" + number + "', `W_EMAIL` = '" + working_email + "', `P_EMAIL` = '" + personal_email + "', `COUNTRY_ID` = '" + country + "', `date_of_birth` = '" + dateofbirth + "', `date_of_joining` = '" + dateofjoining + "' WHERE `players`.`id` = '" + playerId + "'";
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/view/' + playerId);
        });


    },
    admysqlConnectionankPage: (req, res) => {
        res.render('add-bank-details.ejs', {
            title: "Evertz | Add Bank",
            message: ''
        });
    },
    admysqlConnectionank: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;
        let dateofbirth = req.body.date_of_birth;
        let dateofjoining = req.body.date_of_joining;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";

        mysqlConnection.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-bank-details.ejs', {
                    message,
                    title: "Evertz | Add Bank"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name, date_of_birth, date_of_joining) VALUES ('" +
                            first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "','" + dateofbirth + "','" + dateofjoining + "')";
                        mysqlConnection.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-player.ejs', {
                        message,
                        title: "Evertz | Add Bank"
                    });
                }
            }
        });
    },
    payroll_page: (req,res) => {
        res.render("../secret/payroll");
    },
    fetch_id: (req,res) => {
        var emp_id=req.query.send_data
    mysqlConnection.query("select count(*) as count_emp from employee where ID='"+emp_id+"'",function(err1,result1){
        if(err1)
        {
            throw err1
        }
        else
        {
            console.log(result1[0].count_emp)
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
                }
            })
            }
        }
    })
    },
    logout : (req,res) => {
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
                res.redirect("/login")
            }
        })
    }
    },
    login : (req,res) => {
        res.render("login")
    },
    edit_details : (req,res) => {
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
    },
    loginAction : (req,res) => 
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
    },
    list_payroll:(req,res) => {
        mysqlConnection.query("select * from  payroll_management order by id desc limit 0,10",function(err,result){
            if(err)
            {
                throw err
            }
            else
            {
                obj = {print: result};
                res.render('../secret/list-payroll', obj);
            }
        })
    },
    prev_payroll:(req,res) => {
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
            res.render('list-payroll', obj);
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
            res.render('list-payroll', obj);
        }
    })
    }
    },
    next_payroll:(req,res) => {
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
            res.render('list-payroll', obj);
        }
    })
    },
    payroll_edit_action:(req,res) => {
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
    res.redirect("/secret/list-payroll");
    },
    payroll_insert:(req,res) => {
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
        res.redirect("../secret/list-payroll");
    }
};