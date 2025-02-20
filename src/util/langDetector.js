export async function initializeLanguageDetector() {
    if (!("ai" in self) || !("languageDetector" in self.ai)) {
        return { error: "Language Detector API is not available." };
    }

    const capabilities = await self.ai.languageDetector.capabilities();
    if (capabilities.capabilities === "no") {
        return { error: "Language detector is not usable." };
    }

    try {
        let detector;
        if (capabilities.capabilities === "readily") {
            detector = await self.ai.languageDetector.create();
        } else {
            detector = await self.ai.languageDetector.create({
                monitor(m) {
                    m.addEventListener("downloadprogress", (e) => {
                        console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                    });
                },
            });
            await detector.ready;
        }
        return { detector };
    } catch (error) {
        return { error: "Failed to initialize language detector." };
    }
}

export async function detectLanguage(detector, text) {
    if (!detector) return { error: "Language detector is not initialized." };
    if (!text.trim()) return { error: "Please enter text to analyze." };

    try {
        const results = await detector.detect(text);
        return { results: results.map(r => ({
            language: r.detectedLanguage,
            confidence: r.confidence
        })) };
    } catch (error) {
        return { error: "Error detecting language. Please try again." };
    }
}
