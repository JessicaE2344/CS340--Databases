function deleteInstructor(e, inid) {
    const confirmation = confirm(`Are you sure you want to delete instructor ${inid}?`);
    if (!confirmation) {
        return; // If the user clicks "Cancel" (No), do nothing.
    }
    e.preventDefault();
    const instructorId = e.target.getAttribute('data-instructor-id');
    document.getElementById('deleteInstructorId').value = instructorId;
    document.getElementById('deleteForm').submit();
}