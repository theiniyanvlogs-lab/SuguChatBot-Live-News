async function translateNews(button, title, description) {

    const translationArea =
        button.closest(".news-card")
              .querySelector(".translation-area");

    // Check cache
    const cacheKey = btoa(title);

    const cached = localStorage.getItem(cacheKey);

    if (cached) {

        translationArea.innerHTML = cached;

        button.innerHTML = "✅ தமிழில் மொழிபெயர்க்கப்பட்டது";

        button.disabled = true;

        return;
    }

    button.innerHTML = "⏳ Translating...";

    button.disabled = true;

    // Grok API call will go here
}
