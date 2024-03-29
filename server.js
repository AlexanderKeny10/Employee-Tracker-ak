const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: 'Ninty9%offun',
    database: 'employeeDB'
  });

  
  connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');

    startApp();
  });
// What the user will first see once they start the app.
function startApp() {
    inquirer
    .prompt({
      type: "list",
      choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View departments",
        "View roles",
        "View employees",
        "Update employee role",
        "Quit"
      ],
      message: "What would you like to do?",
      name: "option"
    })
    .then(function(result) {
      console.log("You entered: " + result.option);

      switch (result.option) {
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "View departments":
          viewDepartment();
          break;
        case "View roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "Update employee role":
          updateEmployee();
          break;
        default:
          quit();
      }
    });
}
// All of the corresponding functions for adding to the database below
function addDepartment() {
  inquirer.prompt({
        name:"department",
        type: "input",
        message: "Enter a department name.",
    })
    .then(function(answer) {
        const query = connection.query(
              'INSERT INTO department (name) VALUES (?)',
              [answer.department],
              function(err, res) {
                if (err) throw err;
                // Shows the results to the user via console.table
                console.table(res);
                startApp()
              });
    });
}


function addRole() {
    inquirer.prompt([
        {
            name:"roleName",
            type: "input",
            message: "Enter a role name.",
        },
        {
            name:"salaryTotal",
            type:"input",
            message:"Add a salary for this role.",
        },
        {
            name:"departmentID",
            type:"input",
            message:"Pick a department id.",
        },
    ])

    .then(function(answer) {
        connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
          [answer.roleName, answer.salaryTotal, answer.departmentID],
          function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          })
        })
      };
  

  function addEmployee() {
    inquirer.prompt([
        {
            name:"first_name",
            type: "input",
            message: "Enter the employee first name.",
        },
        {
            name:"last_name",
            type: "input",
            message: "Enter the employee last name.",
        },
        {
            name:"roleID",
            type: "input",
            message: "What is the employee's role ID number.",
        },
        {
            name:"managerID",
            type: "input",
            message: "What is the manager's role ID number.",
        }
        
    ])

    .then(function(answer) {
        connection.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [answer.first_name, answer.last_name, answer.roleID, answer.managerID],
            function(err, res) {
                if (err) throw err;
            console.log(res);
            startApp();
        })
    })
  };

//With the inquirer package, we can pass the query into the method as an array.
  function updateEmployee() {
    inquirer
      .prompt([
        {
          name: "employeeUpdate",
          type: "input",
          message: "Pick an Employee to update?",
        },
        {
          name: "updateRole",
          type: "input",
          message: "What role by id would you like to switch to?",
        }
      ])
      .then(function(answer) {
        connection.query('UPDATE employee SET role_id=? WHERE first_name= ?',
        [answer.updateRole, answer.employeeUpdate],
        function(err, res) {
          if (err) throw err;
          console.log(res);
          startApp();
        });
      });
  }


  function viewDepartment() {
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  }
  
  function viewRoles() {
      
    let query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  }
  
  function viewEmployees() {
    console.log('Selecting all Employees... \n');
    // Selects all employee data corresponding to names, title, id, role, and department.
    connection.query( 
    `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name 
    AS Dept_name, employee.manager_id AS manager
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    ORDER BY employee.id;`, 
    function(err, res) {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  }
  
  function quit() {
    connection.end();
    process.exit();
  }
