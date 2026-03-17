const video1 = document.getElementById('projectVideo1');
const video2 = document.getElementById('projectVideo2');

// Sidebar elements
const sideBar = document.querySelector('.sidebar');
const closeIcon = document.querySelector('.close-icon');
const hoverSign = document.querySelector('.hover-sign');

// Video hover interactions
const videoList = [video1, video2].filter(v => v !== null);

videoList.forEach(function(video) {
    video.addEventListener("mouseover", function() {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(function() {
                // Autoplay blocked — silently ignore
            });
        }
        if (hoverSign) hoverSign.classList.add("active");
    });
    video.addEventListener("mouseout", function() {
        video.pause();
        if (hoverSign) hoverSign.classList.remove("active");
    });
});

// Contact form message
function showMessage() {
    alert("Sorry, this feature is under development.\n\nPlease contact me via email: shafrinmunavarsulthan@gmail.com");
}

// Sidebar close
if (closeIcon) {
    closeIcon.addEventListener("click", function() {
        sideBar.classList.remove("open-sidebar");
        sideBar.classList.add("close-sidebar");
    });
}