// public/js/app_student.js
let addStudentForm = document.getElementById('add-student-form-ajax');

addStudentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputFirstName = document.getElementById("input-fname");
    let inputLastName = document.getElementById("input-lname");
    let inputGradeLevel = document.getElementById("input-grade-level");
    let inputGpa = document.getElementById("input-gpa");

    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let gradeLevelValue = inputGradeLevel.value;
    let gpaValue = inputGpa.value;

    // Check for negative values
    if (gpaValue < 0) {
        alert("GPA cannot be negative. Please enter a valid GPA.");
        return;
    }

    if (gradeLevelValue < 9 || gradeLevelValue > 12) {
        alert("Grade level must be between 9 and 12. Please enter a valid grade level.");
        return;
    }

    let data = {
        first_name: firstNameValue,
        last_name: lastNameValue,
        grade_level: gradeLevelValue,
        gpa: gpaValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            inputFirstName.value = '';
            inputLastName.value = '';
            inputGradeLevel.value = '';
            inputGpa.value = '';

            window.location.href = "/students";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
})