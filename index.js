const inquirer = require('inquirer');
const mysql = require('mysql2');
require("dotenv").config()
// Connect to database
const db = mysql.createConnection(
    {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: "localhost",
        port: 3306,

    },
    console.log(`Connected to the employee_tracker_db database.`)
);



  const init = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Please select from the following options:",
                name: "main",
                choices:[
                {
                    Name:"View all departments",
                    value: "departments"
                }, 
                {
                    name: "View all roles",
                    value: "roles"
                },
                {
                    name: "View all employees",
                    value: "employees"
                },
                {
                    name: "Add a department",
                    value: "addDepartment"
                },
                {
                    name: "Add a role",
                    value: "addRole"
                },
                {
                    name: "Add an employee",
                    value: "addEmployee"
                },
                {
                    name: "Update an employee",
                    value: "updateEmployee"
                },
                {
                    name: "Exit",
                    value: "exit"
                },
                , , , , , , ]
            }
        ]).then(result => {
            let choice = result.main
            // console.log(result.main);
            switch (choice) {
                
                case "departments":viewDept();
                    break;
                case "roles": viewRoles();
                    break;
                case "employees": viewEmployees();
                    break;
                case "addDepartment": addDept();
                    break;
                case "addRole": addRole();
                    break;
                case "addEmployee": addEmployee();
                    break;
                    case "updateEmployee": updateEmployee();
                    break;
                case "exit":
                    console.log("Thank you very much!");
                    process.exit();
            }
        }).catch(err => console.error(err));
    }

init()

const viewDept = () => {
    console.log("Working")
    db.query(`SELECT * FROM department`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
};

const viewRoles = () => {
    db.query(`SELECT * FROM roles`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
};

const viewEmployees = () => {
    db.query(`SELECT * FROM employees`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
}

const addDept = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department you'd like to add?",
                name: "addDept"
            }
        ]).then(result => {
            db.query(`INSERT INTO department(name)
                    VALUES(?)`, result.addDept, (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    db.query(`SELECT * FROM department`, (err, results) => {
                        err ? console.error(err) : console.table(results);
                        init();
                    })
                }
            }
            )
        })
};

const addRole = () => {
    const deptChoices = () => db.promise().query(`SELECT * FROM department`)
        .then((rows) => {
            let arrNames = rows[0].map(obj => obj.name);
            return arrNames
        })
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the title of the role you'd like to add?",
                name: "title"
            },
            {
                type: "input",
                message: "What is the salary for this role?",
                name: "salary"
            },
            {
                type: "list",
                message: "Which department is this role in?",
                name: "dept",
                choices: deptChoices
            }
        ]).then(result => {
            db.promise().query(`SELECT id FROM department WHERE name = ?`, result.dept)
                .then(answer => {
                    
                    let mappedId = answer[0].map(obj => obj.id);
                    console.log(mappedId[0])
                    return mappedId[0]
                })
                .then((mappedId) => {
                    db.promise().query(`INSERT INTO roles(title, salary, department_id)
                VALUES(?, ?, ?)`, [result.title, result.salary, mappedId]);
                    init()
                })
        })
};

const addEmployee = () => {
    const allRoles = () => db.promise().query(`SELECT * FROM roles`)
    .then((rows) => {
        let roleNames = rows[0].map(obj => obj.title);
        return roleNames
    })
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "employeeRole",
                choices: allRoles
            }
        ]).then(result => {
            console.log(result.employeeRole)
            db.promise().query(`SELECT id FROM roles WHERE title = ?`, result.employeeRole)
            .then(answer => {
                let roleId = answer[0].map(obj => obj.id);
                return roleId[0]
            })
            .then((roleId) =>{
                // console.log(answer)
                // console.log(roleId[0])
            db.query(`INSERT INTO employees(first_name, last_name, role_id)
                    VALUES(?, ?, ?)`, [result.firstName, result.lastName, roleId], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    db.query(`SELECT * FROM employees`, (err, results) => {
                        err ? console.error(err) : console.table(results);
                        init();
                    })
                }
            }
            )
            
        })
    })
}

const updateEmployee = ()=> {
            // Calling the database to acquire the roles and managers
            db.query(`SELECT * FROM employees, roles`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Choose an Employee to Update
                        type: 'list',
                        name: 'employees',
                        message: 'Which employees role do you want to update?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        // Updating the New Role
                        type: 'list',
                        name: 'roles',
                        message: 'What is their new role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`UPDATE employees SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated role to the database.`)
                        init();
                    });
                })
            });
        }