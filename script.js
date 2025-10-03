document.addEventListener("DOMContentLoaded", () => {
    // Splash screen logic
    setTimeout(() => {
        document.getElementById("splash").classList.add("hidden");
        document.getElementById("main-content").classList.remove("d-none");
    }, 2000);

    // Logout button logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            localStorage.removeItem('userId'); // Clear user session
            // Optionally, clear other session-related items like tokens
            // localStorage.removeItem('userToken');
            window.location.href = 'auth.html'; // Redirect to login page
        });

        // Show/hide logout button based on login status
        const userId = localStorage.getItem('userId');
        if (userId) {
            logoutBtn.style.display = 'flex'; // Show if logged in
        } else {
            logoutBtn.style.display = 'none'; // Hide if not logged in
        }
    }
});
