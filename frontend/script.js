function toggleProfileMenu(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'flex';
    } else {
        dropdown.style.display = 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('profile-dropdown');
    const profileContainer = document.querySelector('.user-profile-container');

    if (dropdown && dropdown.style.display === 'flex') {
        if (!profileContainer.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    }
});
