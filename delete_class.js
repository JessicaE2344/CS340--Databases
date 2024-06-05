function deleteClass(e, clid) {
    const confirmation = confirm(`Are you sure you want to delete class ${clid}?`);
    if (!confirmation) {
        return; // If the user clicks "Cancel" (No), do nothing.
    }
    e.preventDefault();
    let studentId = e.target.getAttribute('data-class-id');
    document.getElementById('deleteClassId').value = studentId;
    document.getElementById('deleteForm').submit();
};