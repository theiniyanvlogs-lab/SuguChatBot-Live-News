/* ==========================================
   SuguChatBot Live News
   Phase 4 - news.js
========================================== */

const CATEGORY_MAP = {
    "🇮🇳 India": { country: "in", category: "top" },
    "🌍 World": { category: "top" },
    "🏛 Tamil Nadu": { country: "in", q: "Tamil Nadu" },
    "💼 Business": { country: "in", category: "business" },
    "⚽ Sports": { country: "in", category: "sports" }
};

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

function displayNews(category, articles) {

    const chatArea = document.getElementById("chatArea");

    chatArea.innerHTML = "";

    articles.forEach(article => {

        const time = new Date().toLocaleTimeString([], {

            hour: "2-digit",
            minute: "2-digit"

        });

        const safeTitle = (article.title || "")
            .replace(/'/g, "\\'")
            .replace(/"/g, "&quot;");

        const safeDescription = (article.description || "")
            .replace(/'/g, "\\'")
            .replace(/"/g, "&quot;");

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

        <p>${article.description || ""}</p>

        <div class="news-actions">

            <button
                onclick="window.open('${article.link}','_blank')">
                🔗 Read More
            </button>

            <button
                class="translate-btn"
                onclick='translateNews(
                    this,
                    ${JSON.stringify(article.title || "")},
                    ${JSON.stringify(article.description || "")}
                )'>

                🌐 Want Tamil Translation 🇮🇳

            </button>

            <button onclick="bookmarkNews()">
                ⭐ Bookmark
            </button>

            <button
                onclick='shareArticle(
                    ${JSON.stringify(article.title || "")},
                    ${JSON.stringify(article.link)}
                )'>

                📤 Share

            </button>

        </div>

        <div class="translation-area"></div>

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

            title: title,

            url: link

        });

    }

    else {

        navigator.clipboard.writeText(link);

        alert("Link copied to clipboard.");

    }

}


/* ==========================================
   Bookmark (Temporary)
========================================== */

function bookmarkNews(){

    alert("Bookmark feature coming soon.");

}


/* ==========================================
   Translate News using Groq
========================================== */

async function translateNews(button, title, description) {

    const translationArea = button
        .closest(".bubble")
        .querySelector(".translation-area");

    const cacheKey = "ta_" + btoa(
        unescape(encodeURIComponent(title))
    );

    const cached = localStorage.getItem(cacheKey);

    if (cached) {

        translationArea.innerHTML = cached;

        button.innerHTML = "✅ தமிழில் மொழிபெயர்க்கப்பட்டது";

        button.disabled = true;

        return;

    }

    button.disabled = true;

    button.innerHTML = "⏳ Translating...";

    try {

        const response = await fetch(CONFIG.GROQ_URL, {

            method: "POST",

            headers: {

                "Authorization": `Bearer ${CONFIG.GROQ_API_KEY}`,

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                model: CONFIG.GROQ_MODEL,

                temperature: 0,

                messages: [

                    {

                        role: "system",

                        content:
`You are an expert Tamil translator.

Translate English news into simple natural Tamil.

Return ONLY valid JSON.

{
"title_ta":"",
"description_ta":""
}`

                    },

                    {

                        role: "user",

                        content:

`Title:
${title}

Description:
${description}`

                    }

                ]

            })

        });

        if (!response.ok) {

            throw new Error("Groq API Error");

        }

        const data = await response.json();

        console.log(data);

        const result = JSON.parse(
            data.choices[0].message.content
        );

        const html = `

<hr>

<h4>🇮🇳 தமிழ் மொழிபெயர்ப்பு</h4>

<p>

<strong>

${result.title_ta}

</strong>

</p>

<p>

${result.description_ta}

</p>

`;

        translationArea.innerHTML = html;

        localStorage.setItem(cacheKey, html);

        button.innerHTML = "✅ தமிழில் மொழிபெயர்க்கப்பட்டது";

    }

    catch(error){

        console.error(error);

        button.disabled = false;

        button.innerHTML = "🌐 Want Tamil Translation 🇮🇳";

        translationArea.innerHTML = `

<p style="color:red;">

❌ Translation Failed

</p>

`;

    }

}

