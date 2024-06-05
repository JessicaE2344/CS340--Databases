let addStudentToClubForm = document.getElementById('add-student-to-club-form');

addStudentToClubForm.addEventListener("submit", function (e) {
  
    e.preventDefault();

    // Get form fields 
    let studentId = document.getElementById("input-student-id").value;
    let clubId = document.getElementById("input-club-id").value;

   
    let data = {
        student_id: studentId,
        clubs_eas_id: clubId
    };

  
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student-to-club", true);
    xhttp.setRequestHeader("Content-type", "application/json");

   
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
        
            window.location.href = "/students_in_clubs";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.error("Error occurred on input.");
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});
