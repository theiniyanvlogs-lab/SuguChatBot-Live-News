/* ==========================================
   SuguChatBot Live News
========================================== */

const CATEGORY_MAP = {
    "🇮🇳 India": { country: "in", category: "top" },
    "🌍 World": { category: "top" },
    "🏛 Tamil Nadu": { country: "in", q: "Tamil Nadu" },
    "💼 Business": { country: "in", category: "business" },
    "⚽ Sports": { country: "in", category: "sports" }
};

/* ==========================================
   Fetch Live News
========================================== */

async function fetchNews(categoryName = "🇮🇳 India") {

    const config = CATEGORY_MAP[categoryName];

    let url = `${CONFIG.BASE_URL}?apikey=${CONFIG.API_KEY}&language=en`;

    if (config.country)
        url += `&country=${config.country}`;

    if (config.category)
        url += `&category=${config.category}`;

    if (config.q)
        url += `&q=${encodeURIComponent(config.q)}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        if (!data.results || data.results.length === 0) {

            showMessage("No live news available.");

            return;

        }

        displayNews(categoryName, data.results.slice(0, 5));

    }
    catch (error) {

        console.error(error);

        showMessage("Unable to load live news.");

    }

}

/* ==========================================
   Display News
========================================== */

function displayNews(category, articles) {

    const chatArea = document.getElementById("chatArea");

    chatArea.innerHTML = "";

    articles.forEach(article => {

        const time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        chatArea.innerHTML += `

<div class="chat-message">

    <img src="images/logo.png" class="bot-avatar">

    <div class="bubble">

        <div class="bubble-header">

            <strong>SuguChatBot Live News</strong>

            <span>${time}</span>

        </div>

        <h3>${category}</h3>

        <p><strong>🇬🇧 ${article.title}</strong></p>

        <p>${article.description || "No description available."}</p>

        <div class="news-actions">

            <button
                onclick="window.open('${article.link}','_blank')">

                🔗 Read More

            </button>

            <button
                onclick="bookmarkNews()">

                ⭐ Bookmark

            </button>

            <button
                onclick='shareArticle(
                    ${JSON.stringify(article.title || "")},
                    ${JSON.stringify(article.link || "")}
                )'>

                📤 Share

            </button>

        </div>

    </div>

</div>

`;

    });

}

/* ==========================================
   Show Message
========================================== */

function showMessage(message) {

    document.getElementById("chatArea").innerHTML = `

<div class="chat-message">

    <img src="images/logo.png" class="bot-avatar">

    <div class="bubble">

        <h3>${message}</h3>

    </div>

</div>

`;

}

/* ==========================================
   Share News
========================================== */

async function shareArticle(title, link) {

    if (navigator.share) {

        await navigator.share({
            title,
            url: link
        });

    } else {

        await navigator.clipboard.writeText(link);

        alert("Link copied to clipboard.");

    }

}

/* ==========================================
   Bookmark (Temporary)
========================================== */

function bookmarkNews() {

    alert("Bookmark feature coming soon.");

}
