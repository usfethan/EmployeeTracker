const express = require("express");
const mysql = require("mysql2");
const table = require("console.table");
const fs = require("fs");
const inquirer = require("inquirer");

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
  console.log("***********************************"),
  console.log("*                                 *"),
  console.log("*        EMPLOYEE MANAGER         *"),
  console.log("*                                 *"),
  console.log("***********************************"),
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
                "View Employees",
                "View Roles",
                "View Departments",
                "Add Employee",
                "Update Employee",
                "Add Role",
                "Add Department",
            ],
        },
    ])
    .then(function (val) {
        switch (val.choice) {
            case "View Employees":
                viewEmployees();
                break;
            
            case "View Roles":
                viewRoles();
                break;
            
            case "View Departments":
                viewDepartments();
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
function viewEmployees() {
    db.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            prompt();
        }
    );
}


//All roles
function viewRoles() {
    db.query(
        "SELECT role.id, role.title, role.department_id, role.salary FROM role;",
        function(err, res) {
            if (err) throw err;
            console.table(res);
            prompt();
        }
    );
}

//all departments
function viewDepartments() {
    db.query(
        "SELECT department.id, department.name FROM department;",
        function(err, res) {
            if(err) throw err;
            console.table(res);
            prompt();
        }
    );
}


var roleArr = [];
function selectRole() {
    db.query("SELECT * FROM role",
    function(err, res) {
        if(err) throw err;
        for (var i = 0; i< res.length; i++) {
            roleArr.push(res[i].title);
        }
    });
    return roleArr;
}

function addDepartment() {
    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?",
        },
        {
          name: "id",
          type: "input",
          message: "What is the ID number for this department?",
        },
      ])
      .then(function (res) {
        db.query(
          "INSERT INTO department SET ? ",
          {
            name: res.name,
            id: res.id
          },
          
          function (err) {
            if (err) throw err;
            console.table(res);
            prompt();
          }
        );
      });
  }


  function addRole() {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the title of the employee?",
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the salary of the employee?",
        },
      ])
      .then(function (res) {
        db.query(
          "INSERT INTO role SET ?",
          { id: roleArr.length++, title: res.Title, salary: res.Salary },
          function (err) {
            if (err) throw err;
            console.table(res);
            prompt();
          }
        );
      });
  }
  
  function addEmployee() {
    inquirer.prompt([
        {
          name: "id",
          type: "input",
          message: "What is the employee ID?",
        },
        {
          name: "firstname",
          type: "input",
          message: "Enter first name of the employee",
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter last name of the employee",
        },
        {
          name: "role",
          type: "list",
          message: "What is the role of the employee? ",
          choices: selectRole(),
        },
        {
          name: "choice1",
          type: "rawlist",
          message: "Who is the manager of the employee?",
          choices: selectManager(),
        },
        {
          name: "choice2",
          type: "rawlist",
          message: "What is the role of the employee?",
          choices: selectRole(),
        },
      ])
      .then(function (val) {
        db.query(
          "INSERT INTO employee SET ?",
          { first_name: res.firstname, last_name: res.lastname },
          function (err) {
            if (err) throw err;
            console.table(val);
            prompt();
          }
        );
      });
  }
  
  

var managersArr = []; 

function selectManager() {
    db.query(
        "SELECT id FROM employee WHERE manager_id IS NULL",
        function(err, res) {
            if(err) throw err;
            for (var i = 0; i< res.length; i++) {
                managersArr.push(res[i].first_name);
            }
        }
    );
    return managersArr;
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});