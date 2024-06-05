
document.getElementById('add-club-form-ajax').addEventListener('submit', function (e) {
    e.preventDefault();

    let clubName = document.getElementById('input-club-name').value;
    let instructorId = document.getElementById('input-instructor').value;
    let meetTime = document.getElementById('input-meet-time').value;
    let weekDay = document.getElementById('input-week-day').value;
    let enrolled = document.getElementById('input-enrolled').value;

    let data = {
        club_name: clubName,
        instructor_id: instructorId,
        meet_time: meetTime,
        week_day: weekDay,
        enrolled: enrolled
    };

    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/add-club-ajax', true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.href = '/clubs_eas';
        }
    };
    xhttp.send(JSON.stringify(data));
});
