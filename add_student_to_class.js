let addStudentToClassForm = document.getElementById('add-student-to-class-form');

addStudentToClassForm.addEventListener("submit", function (e) {
  
    e.preventDefault();

    
    let studentId = document.getElementById("input-student-id").value;
    let classId = document.getElementById("input-class-id").value;

   
    let data = {
        student_id: studentId,
        class_id: classId
    };

   
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student-to-class", true);
    xhttp.setRequestHeader("Content-type", "application/json");

   
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
        
            window.location.href = "/students_in_classes";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
          
            console.error("Error occured on input.");
        }
    };


    xhttp.send(JSON.stringify(data));
});