import { useEffect, useState } from "react";
import { initializeTranslator, translateText } from "../util/translator";

export default function TranslatorComponent() {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [sourceLang, setSourceLang] = useState("es");
    const [targetLang, setTargetLang] = useState("fr");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [translator, setTranslator] = useState(null);

    useEffect(() => {
        let interval;

        const setupTranslator = async () => {
            const { translator, error } = await initializeTranslator(sourceLang, targetLang);
            if (error) {
                setError(error);
                setLoading(false);
                return;
            }

            setTranslator(translator);
            setLoading(false);

            // Set up interval for automatic translation
            interval = setInterval(async () => {
                if (text.trim() !== "") {
                    const { translatedText, error } = await translateText(translator, text);
                    if (error) {
                        setError(error);
                    } else {
                        setTranslatedText(translatedText);
                        setError(null);
                    }
                }
            }, 2000);
        };

        setupTranslator();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [text, sourceLang, targetLang]);

    return (
        <div className="p-4 max-w-md mx-auto border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">AI Translator</h2>
            
            <div className="flex gap-2">
                <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="p-2 border rounded-lg">
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="en">English</option>
                    <option value="de">German</option>
                </select>

                <span className="text-lg">➡️</span>

                <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="p-2 border rounded-lg">
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="en">English</option>
                    <option value="de">German</option>
                </select>
            </div>

            <textarea
                className="w-full p-2 mt-2 border rounded-lg"
                placeholder="Enter text..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            {loading && <p className="text-blue-500 mt-2">Loading translation model...</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {translatedText && (
                <p className="mt-2 p-2 border rounded-lg bg-gray-100">
                    <strong>Translation:</strong> {translatedText}
                </p>
            )}
        </div>
    );
}
