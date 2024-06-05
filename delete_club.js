function deleteClub(event, clubId) {
    event.preventDefault();

    let deleteForm = document.getElementById('deleteForm');
    let deleteClubId = document.getElementById('deleteClubId');

    deleteClubId.value = clubId;

    deleteForm.submit();
}
