var express = require('express');
var exphbs = require('express-handlebars');
var db = require('./database/db-connector');

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const { engine } = require('express-handlebars');
app.engine('.hbs', engine({
    extname: ".hbs",
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        }
    }
}));
app.set('view engine', '.hbs');

const PORT = 23446;

/*
    ROUTES
*/
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/students', function(req, res) {
    let query1 = "SELECT * FROM students;";
    db.pool.query(query1, function(error, results, fields){
        if (error) {
            console.error(error);
            return res.status(500).send('Database error occurred.');
        }
        res.render('students', { data: results });
    });
});

app.get('/classes', function(req, res) {
    let query1 = `
    SELECT classes.class_id, instructors.last_name as instructor, classes.class_name, classes.capacity, classes.enrolled,
    classes.class_time, classes.week_day  FROM classes LEFT JOIN instructors ON classes.instructor_id = instructors.instructor_id;
    `;
    db.pool.query(query1, function(error, results, fields){
        if (error) {
            console.error(error);
            return res.status(500).send('Database error occurred.');
        }
        res.render('classes', { data: results });
    });
});

app.get('/add_class', function(req, res){

    let instructorsQuery = `
    SELECT instructor_id, last_name 
    FROM instructors;
    `;

    db.pool.query(instructorsQuery, function(error, instructorResults) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }

        res.render('add_class', { 
            instructors: instructorResults 
        });
    });
});

app.post('/add-class-ajax', function(req, res) {
    let data = req.body;

    // Handle the case where instructor_id is null
    let instructorId = data.instructor_id ? data.instructor_id : null;

    let query = `
        INSERT INTO classes (class_name, instructor_id, capacity, enrolled, class_time, week_day)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    db.pool.query(query, [data.class_name, instructorId, data.capacity, data.enrolled, data.class_time, data.week_day], function(error, results, fields) {
        if (error) {
            console.error("Database insertion error:", error);
            return res.status(500).send('Database error occurred.');
        }
        res.redirect('/classes');
    });
});

app.post('/delete_class', function(req, res) {
    let data = req.body;
    let query = `DELETE FROM classes WHERE class_id = ?`;
    db.pool.query(query, [data.class_id], function(error, results, fields) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }
        res.redirect('/classes');
    });
});

app.get('/update_class', function(req, res) {
    let classId = req.query.class_id; 

    let classQuery = `
    SELECT classes.class_id, classes.instructor_id, classes.class_name, classes.capacity, classes.enrolled,
    classes.class_time, classes.week_day 
    FROM classes 
    WHERE class_id = ?;
    `;

    let instructorsQuery = `
    SELECT instructor_id, last_name 
    FROM instructors;
    `;

    db.pool.query(classQuery, [classId], function(error, classResults) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }

        if (classResults.length > 0) {
            db.pool.query(instructorsQuery, function(error, instructorResults) {
                if (error) {
                    console.error("Database error occurred:", error);
                    return res.status(500).send('Database error occurred.');
                }

                res.render('update_class', { 
                    class: classResults[0], 
                    instructors: instructorResults 
                });
            });
        } else {
            console.log("Class not found for ID:", classId);
            res.status(404).send('Class not found.');
        }
    });
});

app.post('/update_class', function(req, res) {
    let data = req.body;
    console.log("Received update data:", data);

    if (data.instructor_id === '') {
        data.instructor_id = null;
    }

    let queryUpdate = `
        UPDATE classes 
        SET class_name = ?, instructor_id = ?, capacity = ?, enrolled = ?, class_time = ?, week_day = ? 
        WHERE class_id = ?;`;


    db.pool.query(queryUpdate, [data.class_name, data.instructor_id, data.capacity, data.enrolled, data.class_time, data.week_day, data.class_id], function(error, results, fields) {
        if (error) {
            console.error("Database update error:", error);
            return res.status(500).send('Database error occurred.');
        }
        console.log("Update successful:", results);

        res.redirect('/classes');
    });
});


app.get('/update_student', function(req, res) {
    let studentId = req.query.student_id;
    let query = "SELECT * FROM students WHERE student_id = ?";

    db.pool.query(query, [studentId], function(error, results, fields) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }
        if (results.length > 0) {
            res.render('update_student', { student: results[0] });
        } else {
            res.status(404).send('Student not found.');
        }
    });
});

app.post('/delete_student', function(req, res) {
    let studentId = req.body.student_id;
    let query = "DELETE FROM students WHERE student_id = ?";

    db.pool.query(query, [studentId], function(error, results, fields) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }
        res.redirect('/students');
    });
});

app.get('/add_student', function(req, res) {
    res.render('add_student');
});

app.post('/add-student-ajax', function(req, res) {
    let data = req.body;
    let query1 = `INSERT INTO students (first_name, last_name, grade_level, gpa) VALUES (?, ?, ?, ?)`;
    
    db.pool.query(query1, [data.first_name, data.last_name, data.grade_level, data.gpa], function(error, results, fields){
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        res.redirect('/students');
    });
});

app.post('/update_student', function(req, res) {
    let data = req.body;
    let queryUpdate = `
        UPDATE students 
        SET first_name = ?, last_name = ?, grade_level = ?, gpa = ?
        WHERE student_id = ?`;

    db.pool.query(queryUpdate, [data.first_name, data.last_name, data.grade_level, data.gpa, data.id], function(error, results, fields) {
        if (error) {
            console.error("Database update error:", error);
            return res.status(500).send('Database error occurred.');
        }
        res.redirect('/students');
    });
});

// GET all instructors
app.get('/instructors', function(req, res) {
    let query = "SELECT * FROM instructors;";
    db.pool.query(query, function(error, results, fields){
        if (error) {
            console.error(error);
            return res.status(500).send('Database error occurred.');
        }
        res.render('instructors', { data: results });
    });
});

// GET form to add a new instructor
app.get('/add_instructor', function(req, res) {
    res.render('add_instructor');
});

// POST to add a new instructor
app.post('/add-instructor-ajax', function(req, res) {
    let data = req.body;
    let query = `INSERT INTO instructors (first_name, last_name) VALUES (?, ?)`;
    db.pool.query(query, [data.first_name, data.last_name], function(error, results, fields){
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }
        res.redirect('/instructors');
    });
});

// GET form to update an instructor
app.get('/update_instructor', function(req, res) {
    let instructorId = req.query.instructor_id;
    let query = "SELECT * FROM instructors WHERE instructor_id = ?";

    db.pool.query(query, [instructorId], function(error, results, fields) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }
        if (results.length > 0) {
            res.render('update_instructor', { instructor: results[0] });
        } else {
            res.status(404).send('Instructor not found.');
        }
    });
});

// POST to update an instructor
app.post('/update_instructor', function(req, res) {
    let data = req.body;
    let queryUpdate = `
        UPDATE instructors 
        SET first_name = ?, last_name = ?
        WHERE instructor_id = ?`;

    db.pool.query(queryUpdate, [data.first_name, data.last_name, data.instructor_id], function(error, results, fields) {
        if (error) {
            console.error("Database update error:", error);
            return res.status(500).send('Database error occurred.');
        }
        res.redirect('/instructors');
    });
});

// POST to delete an instructor
app.post('/delete_instructor', function(req, res) {
    let data = req.body;
    let query = `DELETE FROM instructors WHERE instructor_id = ?`;
    db.pool.query(query, [data.instructor_id], function(error, results, fields) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }
        res.redirect('/instructors');
    });
});

app.get('/students_in_classes', function(req, res) {
    let query = `
        SELECT 
            students_in_classes.students_in_classes_id,
            students.student_id, 
            students.first_name, 
            students.last_name, 
            classes.class_id, 
            classes.class_name 
        FROM 
            students_in_classes
        INNER JOIN 
            students ON students_in_classes.student_id = students.student_id
        INNER JOIN 
            classes ON students_in_classes.class_id = classes.class_id;
    `;
    db.pool.query(query, function(error, results, fields) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }
        res.render('students_in_classes', { data: results });
    });
});

app.get('/add_student_to_class', function(req, res) {
    let queryStudents = "SELECT student_id, first_name, last_name FROM students;";
    let queryClasses = "SELECT class_id, class_name FROM classes;";

    db.pool.query(queryStudents, function(error, students, fields) {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).send('Database error.');
        }
        
        db.pool.query(queryClasses, function(error, classes, fields) {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).send('Database error.');
            }

            res.render('add_student_to_class', { students: students, classes: classes });
        });
    });
});

app.post('/add-student-to-class', function(req, res) {
    let data = req.body;
    let query = `INSERT INTO students_in_classes (student_id, class_id) VALUES (?, ?)`;
    db.pool.query(query, [data.student_id, data.class_id], function(error, results, fields) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }
        res.redirect('/students_in_classes');
    });
});

app.post('/delete-student-from-class', function(req, res) {
    let data = req.body;
    let query = `DELETE FROM students_in_classes WHERE student_id = ? AND class_id = ?`;
    db.pool.query(query, [data.student_id, data.class_id], function(error, results, fields) {
        if (error) {
            console.error("Database error occurred:", error);
            return res.status(500).send('Database error occurred.');
        }
        res.redirect('/students_in_classes');
    });
});


app.get('/update_student_in_class', function(req, res) {
    let studentsInClassesId = req.query.students_in_classes_id;

    let query1 = "SELECT * FROM students_in_classes WHERE students_in_classes_id = ?";
    let query2 = "SELECT student_id, first_name, last_name FROM students";
    let query3 = "SELECT class_id, class_name FROM classes";

    db.pool.query(query1, [studentsInClassesId], function(error, studentInClassResults, fields) {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).send('Database error.');
        }

        db.pool.query(query2, function(error, studentResults, fields) {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).send('Database error.');
            }

            db.pool.query(query3, function(error, classResults, fields) {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).send('Database error.');
                }

                if (studentInClassResults.length > 0) {
                    res.render('update_student_in_class', {
                        studentInClass: studentInClassResults[0],
                        students: studentResults,
                        classes: classResults
                    });
                } else {
                    res.status(404).send('Student in class not found.');
                }
            });
        });
    });
});

app.post('/update_student_in_class', function(req, res) {
    let data = req.body;
    console.log("Received update data:", data);

    let queryUpdate = `
        UPDATE students_in_classes 
        SET student_id = ?, class_id = ?
        WHERE students_in_classes_id = ?`;

    db.pool.query(queryUpdate, [data.student_id, data.class_id, data.students_in_classes_id], function(error, results, fields) {
        if (error) {
            console.error("Database update error:", error);
            return res.status(500).send('Database error occurred.');
        }
        console.log("Update successful:", results);

        res.redirect('/students_in_classes');
    });
});

/*
    LISTENER
*/
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});
