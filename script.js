/* ==========================================
   SuguChatBot Live News
   Phase 1 - script.js
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

        categories.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        loadCategory(button.innerText);

    });

});

// ================================
// Chat Area
// ================================

const chatArea = document.getElementById("chatArea");

function loadCategory(category){

    let english = "";
    let tamil = "";

    switch(category){

        case "🇮🇳 India":

            english = "Showing today's top India news.";
            tamil = "இன்றைய இந்தியாவின் முக்கிய செய்திகள்.";

            break;

        case "🌍 World":

            english = "Showing today's world news.";
            tamil = "இன்றைய உலக செய்திகள்.";

            break;

        case "🏛 Tamil Nadu":

            english = "Showing Tamil Nadu headlines.";
            tamil = "தமிழகத்தின் முக்கிய செய்திகள்.";

            break;

        case "💼 Business":

            english = "Showing Business & Market updates.";
            tamil = "வணிக மற்றும் பங்குச்சந்தை செய்திகள்.";

            break;

        case "⚽ Sports":

            english = "Showing today's sports news.";
            tamil = "இன்றைய விளையாட்டு செய்திகள்.";

            break;

        default:

            english = "Welcome";
            tamil = "வரவேற்கிறோம்";

    }

    const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    chatArea.innerHTML = `

<div class="chat-message">

<img src="images/logo.png" class="bot-avatar">

<div class="bubble">

<div class="bubble-header">

<strong>SuguChatBot Live News</strong>

<span>${time}</span>

</div>

<h3>${category}</h3>

<p>${english}</p>

<p>${tamil}</p>

<div class="news-actions">

<button onclick="readMore()">
🔗 Read More
</button>

<button onclick="bookmarkNews()">
⭐ Bookmark
</button>

<button onclick="shareNews()">
📤 Share
</button>

</div>

</div>

</div>

`;

}

// ================================
// Search
// ================================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function(){

    const keyword = this.value.toLowerCase();

    categories.forEach(btn=>{

        if(btn.innerText.toLowerCase().includes(keyword)){

            btn.style.display="inline-block";

        }else{

            btn.style.display="none";

        }

    });

});

// ================================
// Buttons
// ================================

function readMore(){

    alert("🚀 Live news will be available in Phase 2.");

}

function bookmarkNews(){

    alert("⭐ Bookmark feature coming soon.");

}

function shareNews(){

    if(navigator.share){

        navigator.share({

            title:"SuguChatBot Live News",

            text:"Check out SuguChatBot Live News!",

            url:window.location.href

        });

    }else{

        alert("📤 Share is not supported on this browser.");

    }

}

// ================================
// Welcome Animation
// ================================

window.onload = () => {

    console.log("🤖 SuguChatBot Live News Loaded");

};
