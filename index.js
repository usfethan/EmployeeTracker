const mysql = require("mysql2");
const cTable = require("console.table");
const fs = require("fs");
const inquirer = require("inquirer");
const { connect } = require("http2");
const Connection = require("mysql2/typings/mysql/lib/Connection");
const { start } = require("repl");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Fn04061241*",
        database: "employeetracker_db",
    },
    console.log("Connected to the database!")
);


app.use((req, res) => {
    res.status(404).end();
});


prompt();

function prompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Roles",
                "View All Employees by Departments",
                "Add Employee",
                "Update Employee",
                "Add Role",
                "Add Department",
            ],
        },
    ])
    .then(function (val) {
        switch (val.choice) {
            case "View All Employees":
                viewAllEmployees();
                break;
            
            case "View All Employees by Roles":
                viewAllRoles();
                break;
            
            case "View All Employees by Departments":
                viewAllDepartments();
                break;
            
            case "Add Employee":
                addEmployee();
                break;
            
            case "Update Employee":
                updateEmployee();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Department":
                addDepartment();
                break;
        }
    });
}


//For all employees
function viewAllEmployees() {
    connection.query(
        "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, '', e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department = role.department_id left join employee e on employee.manager_id = e.id;",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
        }
    );
}


//All roles
function viewAllRoles() {
    connection.query(
        "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
        function(err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
        }
    );
}

//all employees by department
function viewAllDepartments() {
    connection.query(
        "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        function(err, res) {
            if(err) throw err;
            console.table(res);
            startPrompt();
        }
    );
}
//add epmployee
var roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM role",
    function(err, res) {
        if(err) throw err;
        for (var i = 0; i< res.length; i++) {
            roleArr.push(res[i].title);
        }
    });
    return roleArr;
}

var managersArr = []; 
function selectManager() {
    connection.query(
        "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
        function(err, res) {
            if(err) throw err;
            for (var i = 0; i< res.length; i++) {
                managersArr.push(res[i].first_name);
            }
        }
    );
    return managersArr;
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter first name"
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter last name"
        },
        {
            name: "role",
            type: "input",
            message: "Enter a role"
        },
        {
            name: "choice",
            type: "rawlist",
            message: "What is their managers name?",
            choices: selectManager(),
        },
    ])
    .then(function (val) {
        var roleId = selectRole().indexOf(val.role) +1;
        var managerId = selectManager().indexOf(val.choice) +1;
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: val.firstName,
                last_name: val.lastName,
                manager_id: managerId,
                role_id: roleId
            },
            function(err) {
                if(err) throw err;
                console.table(val);
                startPrompt();
            }
        );
    });
}

//update employee
function updateEmployee() {
    connection.query(
        "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
        function (err, res) {
            if(err) throw err;
            console.log(res);
            inquirer.prompt([
                {
                    name: "lastName",
                    type: "rawlist",
                    choices: function() {
                        var lastName = [];
                        for (var i = 0; i < res.length; i++) {
                            lastName.push(res[i].last_name);
                        }
                        return lastName;
                    },
                    message: "What is the employee's last name?"
                },
                {
                    name: "role",
                    type: "rawlist",
                    message: "What is the employee's new title?",
                    choices: selectRole()
                },
            ])
            .then(function (val) {
                var roleId = selectRole().indexOf(val.role) +1;
                connection.query(
                    "UPDATE employee SET WHERE ?",
                    {
                        last_name: val.lastName
                    },
                    {
                        role_id: roleId
                    },
                    function(err) {
                        if(err) throw err;
                        console.table(val);
                        startPrompt();
                    }
                );
            });
        }
    );
}

//ad roles

function addRole() {
    
}








app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});