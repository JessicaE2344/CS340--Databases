let addClassForm = document.getElementById('add-class-form-ajax');

addClassForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    let className = document.getElementById("input-class-name").value;
    let instructorId = document.getElementById("input-instructor").value || null;
    let capacity = document.getElementById("input-capacity").value;
    let enrolled = document.getElementById("input-enrolled").value;
    let classTime = document.getElementById("input-class-time").value;
    let weekDay = document.getElementById("input-week-day").value;

    // Create data object
    let data = {
        class_name: className,
        instructor_id: instructorId,
        capacity: capacity,
        enrolled: enrolled,
        class_time: classTime,
        week_day: weekDay
    };

    // AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-class-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            window.location.href = "/classes";
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.error("Error occurred on input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});