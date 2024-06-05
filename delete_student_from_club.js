function deleteStudentFromClub(e, sicid) {
    const confirmation = confirm(`Are you sure you want to delete this student from the club?`);
    if (!confirmation) {
        return; 
    }

    e.preventDefault();

    const studentId = e.target.getAttribute('data-student-id');
    const clubId = e.target.getAttribute('data-club-id');

    const deleteForm = document.getElementById('deleteForm');
    deleteForm.querySelector('#deleteStudentId').value = studentId;
    deleteForm.querySelector('#deleteClubId').value = clubId;

    deleteForm.submit();
}
