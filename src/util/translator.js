export async function initializeTranslator(sourceLang, targetLang) {
    if (!("ai" in self) || !("translator" in self.ai)) {
        return { error: "Translator API is not available." };
    }

    const capabilities = await self.ai.translator.capabilities();
    const availability = capabilities.languagePairAvailable(sourceLang, targetLang);

    try {
        const translator = await self.ai.translator.create({
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
            monitor(m) {
                m.addEventListener("downloadprogress", (e) => {
                    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                });
            },
        });

        if (availability !== "readily") {
            console.log(`Downloading language model for ${sourceLang} ➡️ ${targetLang}...`);
            await translator.ready;
        }

        return { translator };
    } catch (error) {
        return { error: "Failed to initialize translator. Please try again later." };
    }
}

export async function translateText(translator, text) {
    if (!translator) return { error: "Translator is not initialized." };
    if (!text.trim()) return { error: "Please enter text to translate." };

    try {
        const translatedText = await translator.translate(text);
        return { translatedText };
    } catch (error) {
        return { error: "Error translating text. Please try again." };
    }
}
