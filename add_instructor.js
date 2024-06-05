let addInstructorForm = document.getElementById('add-instructor-form-ajax');

addInstructorForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let firstName = document.getElementById("input-first-name").value;
    let lastName = document.getElementById("input-last-name").value;

    let data = {
        first_name: firstName,
        last_name: lastName
    };

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-instructor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            window.location.href = "/instructors";
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.error("Error occurred on input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});