function deleteStudentFromClass(e, sicid) {
    const confirmation = confirm(`Are you sure you want to delete this student_in_class?`);
    if (!confirmation) {
        return; // If the user clicks "Cancel" (No), do nothing.
    }

    e.preventDefault();

    const studentId = e.target.getAttribute('data-student-id');
    const classId = e.target.getAttribute('data-class-id');

    const deleteForm = document.getElementById('deleteForm');
    deleteForm.querySelector('#deleteStudentId').value = studentId;
    deleteForm.querySelector('#deleteClassId').value = classId;

    deleteForm.submit();
}