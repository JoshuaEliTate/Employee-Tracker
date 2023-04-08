INSERT INTO department(name)
    VALUES  ("Engineering"),
            ("Finance"),
            ("Legal"),
            ("Sales");

INSERT INTO roles(title, salary, department_id)
    VALUES  ("Sales Lead", 80000, 4),
            ("Salesperson", 60000, 4),
            ("Lead Engineer", 120000, 1),
            ("Account Manager", 75000, 2),
            ("Accountant", 140000, 3),
            ("Legal Team Lead", 200000, 3),
            ("Lawyer", 180000, 3);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
    VALUES  ("Josh", "Brown", 1, NULL),
            ("Dave", "Buster", 2, 1),
            ("Tannis", "Olson", 2, 1),
            ("Big", "Tuna", 3, NULL),
            ("Connor", "Slack", 4, NULL),
            ("Who", "IDK", 5, 5),
            ("H", "Purple", 5, 5),
            ("Cranberry", "Sprite", 6, NULL),
            ("Candy", "Man", 7, 8),
            ("Cute", "Cat", 7, 8);