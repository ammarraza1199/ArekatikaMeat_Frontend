document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("splash").classList.add("hidden");
        document.getElementById("main-content").classList.remove("d-none");
    }, 2000);
});
