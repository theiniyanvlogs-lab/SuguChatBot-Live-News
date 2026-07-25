/* ==========================================
   Translate News (Grok)
========================================== */

async function translateNews(button, title, description) {

    const translationArea = button
        .closest(".bubble")
        .querySelector(".translation-area");

    // Cache Key
    const cacheKey = "ta_" + btoa(unescape(encodeURIComponent(title)));

    // Check Cache
    const cached = localStorage.getItem(cacheKey);

    if (cached) {

        translationArea.innerHTML = cached;

        button.innerHTML = "✅ தமிழில் மொழிபெயர்க்கப்பட்டது";
        button.disabled = true;

        return;
    }

    button.innerHTML = "⏳ Translating...";
    button.disabled = true;

    try {

        // =====================================================
        // Grok API Call (Add in next step)
        // =====================================================

        /*
        const response = await fetch(CONFIG.GROK_URL, {

            method: "POST",

            headers: {
                "Authorization": "Bearer " + CONFIG.GROK_API_KEY,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: CONFIG.GROK_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "Translate English news into simple, natural Tamil. Return JSON only."
                    },
                    {
                        role: "user",
                        content: `
Title:
${title}

Description:
${description}

Return JSON:

{
"title_ta":"",
"description_ta":""
}
`
                    }
                ],
                temperature: 0
            })

        });

        const data = await response.json();

        const result = JSON.parse(data.choices[0].message.content);

        */

        // ============================
        // Temporary Demo Output
        // ============================

        const result = {

            title_ta: "இங்கு Grok தமிழில் தலைப்பை வழங்கும்",

            description_ta: "இங்கு Grok தமிழில் செய்தி விளக்கத்தை வழங்கும்."

        };

        const html = `

<hr>

<h4>🇮🇳 தமிழ் மொழிபெயர்ப்பு</h4>

<p><strong>${result.title_ta}</strong></p>

<p>${result.description_ta}</p>

`;

        translationArea.innerHTML = html;

        localStorage.setItem(cacheKey, html);

        button.innerHTML = "✅ தமிழில் மொழிபெயர்க்கப்பட்டது";

    }

    catch (error) {

        console.error(error);

        button.innerHTML = "🌐 Want Tamil Translation 🇮🇳";

        button.disabled = false;

        translationArea.innerHTML = `

<p style="color:red;">
Translation failed. Please try again.
</p>

`;

    }

}
