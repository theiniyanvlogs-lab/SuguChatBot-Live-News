/* ==========================================
   SuguChatBot Live News
   Phase 5 - news.js
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

    <img src="images/logo.png"
         class="bot-avatar">

    <div class="bubble">

        <div class="bubble-header">

            <strong>
                SuguChatBot Live News
            </strong>

            <span>${time}</span>

        </div>

        <h3>${category}</h3>

        <p>

            <strong>

                🇬🇧 ${article.title}

            </strong>

        </p>

        <p>

            ${article.description || "No description available."}

        </p>

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

    // Check Cache
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

                        content: `You are a professional English to Tamil translator.

Translate the English title and description into natural Tamil.

IMPORTANT:

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use \`\`\`json.

Do NOT explain anything.

Example:

{
"title_ta":"தமிழ் தலைப்பு",
"description_ta":"தமிழ் விளக்கம்"
}`

                    },

                    {

                        role: "user",

                        content: `Title:
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

        console.log("Groq Response:", data);

        let content = data.choices[0].message.content.trim();

        console.log("Raw Content:", content);

        // Remove markdown if returned
        content = content
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Extract JSON only
        const start = content.indexOf("{");
        const end = content.lastIndexOf("}");

        if (start === -1 || end === -1) {

            throw new Error("JSON not found.");

        }

        content = content.substring(start, end + 1);

        console.log("Clean JSON:", content);

        const result = JSON.parse(content);

        const html = `

<hr>

<h4>🇮🇳 தமிழ் மொழிபெயர்ப்பு</h4>

<p>

<strong>${result.title_ta}</strong>

</p>

<p>

${result.description_ta}

</p>

`;

        translationArea.innerHTML = html;

        localStorage.setItem(cacheKey, html);

        button.innerHTML = "✅ தமிழில் மொழிபெயர்க்கப்பட்டது";

    }

    catch (error) {

        console.error(error);

        button.disabled = false;

        button.innerHTML = "🌐 Want Tamil Translation 🇮🇳";

        translationArea.innerHTML = `

<p style="color:red">

❌ Translation Failed

</p>

`;

    }

}

