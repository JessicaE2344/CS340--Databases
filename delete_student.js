function deleteStudent(e, stid) {
    const confirmation = confirm(`Are you sure you want to delete student ${stid}?`);
    if (!confirmation) {
        return; // If the user clicks "Cancel" (No), do nothing.
    }
    e.preventDefault();
    let studentId = e.target.getAttribute('data-student-id');
    document.getElementById('deleteStudentId').value = studentId;
    document.getElementById('deleteForm').submit();
};