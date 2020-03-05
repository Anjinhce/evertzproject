module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM employee ORDER BY id DESC"; // query database to get all the Employees


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