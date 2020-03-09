module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT employee.EMP_ID,employee.PHOTO_PATH,employee.FIRTS_NAME,employee.MIDDLE_NAME,employee.LAST_NAME,designation.DESIGNATION,employee.DATE_OF_JOIN,employee.DATE_OF_BIRTH,employee.P_EMAIL,employee.P_PHONE,employee.W_EMAIL,employee.W_PHONE from employee,gender,designation WHERE employee.GENDER_ID=gender.ID and designation.ID=employee.DESIGNATION_ID";


        // execute query
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('../secret/list-employee.ejs', {
                title: "Evertz ERP | View",
                users: result
            });
        });
    },
};