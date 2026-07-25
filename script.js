/* ==========================================
   SuguChatBot Live News
   Phase 2 - script.js
========================================== */

// ================================
// Dark Mode
// ================================

const darkBtn = document.getElementById("darkModeBtn");

darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// ================================
// Category Buttons
// ================================

const categories = document.querySelectorAll(".category");

categories.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class
        categories.forEach(btn => btn.classList.remove("active"));

        // Add active class
        button.classList.add("active");

        // Load Live News
        fetchNews(button.innerText);

    });

});

// ================================
// Search Categories
// ================================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    categories.forEach(btn => {

        if (btn.innerText.toLowerCase().includes(keyword)) {

            btn.style.display = "inline-block";

        } else {

            btn.style.display = "none";

        }

    });

});

// ================================
// Bookmark
// ================================

function bookmarkNews() {

    alert("⭐ Bookmark feature will be added in the next phase.");

}

// ================================
// Share Website
// ================================

function shareNews() {

    if (navigator.share) {

        navigator.share({

            title: "SuguChatBot Live News",

            text: "Check out SuguChatBot Live News!",

            url: window.location.href

        });

    } else {

        navigator.clipboard.writeText(window.location.href);

        alert("Website link copied to clipboard.");

    }

}

// ================================
// Read More (Fallback)
// ================================

function readMore() {

    alert("Please click the 'Read More' button below each news article.");

}

// ================================
// App Startup
// ================================

window.onload = () => {

    console.log("🤖 SuguChatBot Live News Started");

    // Load India News by default
    fetchNews("🇮🇳 India");

};
