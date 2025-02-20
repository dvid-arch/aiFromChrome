import { useEffect, useState } from "react";
import { initializeLanguageDetector, detectLanguage } from "../util/languageDetector";

export default function LanguageDetectorComponent() {
    const [text, setText] = useState("");
    const [detectedLanguages, setDetectedLanguages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detector, setDetector] = useState(null);

    useEffect(() => {
        let interval;

        const setupDetector = async () => {
            const { detector, error } = await initializeLanguageDetector();
            if (error) {
                setError(error);
                setLoading(false);
                return;
            }

            setDetector(detector);
            setLoading(false);

            // Set up interval for detecting language
            interval = setInterval(async () => {
                if (text.trim() !== "") {
                    const { results, error } = await detectLanguage(detector, text);
                    if (error) {
                        setError(error);
                    } else {
                        setDetectedLanguages(results);
                        setError(null);
                    }
                }
            }, 2000);
        };

        setupDetector();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [text]);

    return (
        <div className="p-4 max-w-md mx-auto border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Language Detector</h2>
            <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Type something..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {loading && <p className="text-blue-500 mt-2">Loading language model...</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <ul className="mt-2">
                {detectedLanguages.map((lang, index) => (
                    <li key={index} className="text-gray-700">
                        {lang.language} - Confidence: {lang.confidence.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
