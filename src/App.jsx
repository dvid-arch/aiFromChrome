import { useEffect, useState } from "react";
import { initializeLanguageDetector, detectLanguage } from "./util/langDetector";
import { initializeTranslator, translateText } from "./util/translator";

// Helper function to format critical errors.
function formatError(message) {
  if (!message) return "";
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("not available")) {
    return "Your device or browser does not support this feature. Please try updating your device or using a different browser.";
  }
  return message;
}

export default function UnifiedTextProcessor() {
  // Persist text, mode, sourceLang, and targetLang using localStorage.
  const [text, setText] = useState(() => localStorage.getItem("utp_text") || "");
  const [mode, setMode] = useState(() => localStorage.getItem("utp_mode") || "detect");
  const [sourceLang, setSourceLang] = useState(() => localStorage.getItem("utp_sourceLang") || "en");
  const [targetLang, setTargetLang] = useState(() => localStorage.getItem("utp_targetLang") || "fr");

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detector, setDetector] = useState(null);
  const [translator, setTranslator] = useState(null);
  const [copied, setCopied] = useState(false);

  // Update localStorage when state changes.
  useEffect(() => {
    localStorage.setItem("utp_text", text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem("utp_mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("utp_sourceLang", sourceLang);
  }, [sourceLang]);

  useEffect(() => {
    localStorage.setItem("utp_targetLang", targetLang);
  }, [targetLang]);

  // Initialize the appropriate model when mode or language settings change.
  useEffect(() => {
    setError(null);
    setResult(null);
    setLoading(true);

    if (mode === "detect") {
      initializeLanguageDetector().then(({ detector: newDetector, error: initError }) => {
        if (initError) {
          setError(formatError(initError));
        } else {
          setDetector(newDetector);
        }
        setLoading(false);
      });
    } else if (mode === "translate") {
      if (sourceLang === targetLang) {
        setTranslator(null);
        setLoading(false);
        return;
      }
      initializeTranslator(sourceLang, targetLang).then(({ translator: newTranslator, error: initError }) => {
        if (initError) {
          setError(formatError(initError));
        } else {
          setTranslator(newTranslator);
        }
        setLoading(false);
      });
    } else {
      setDetector(null);
      setTranslator(null);
      setLoading(false);
    }
  }, [mode, sourceLang, targetLang]);

  // Process the text every 2 seconds.
  useEffect(() => {
    let interval;
    const processText = async () => {
      if (!text.trim()) {
        setResult(null);
        return;
      }
      setError(null);
      try {
        if (mode === "detect") {
          if (!detector) return; // Wait until detector is ready.
          const { results, error: detectError } = await detectLanguage(detector, text);
          if (detectError) throw new Error(detectError);
          if (results && results.length > 0) {
            const topResult = results.reduce(
              (prev, curr) => (curr.confidence > prev.confidence ? curr : prev),
              results[0]
            );
            setResult(topResult);
          } else {
            setResult(null);
          }
        } else if (mode === "translate") {
          if (sourceLang === targetLang) {
            setResult("Source and target languages are identical. No translation needed.");
            return;
          }
          if (!translator) return; // Wait until translator is ready.
          const { translatedText, error: transError } = await translateText(translator, text);
          if (transError) throw new Error(transError);
          setResult(translatedText);
        } else if (mode === "summarize") {
          if (text.length < 50) {
            throw new Error("Please provide a longer text for summarization");
          }
          const summary = text.slice(0, Math.floor(text.length / 3)) + "...";
          setResult(summary);
        }
      } catch (err) {
        setError(formatError(err.message));
        setResult(null);
      }
    };

    processText();
    interval = setInterval(processText, 2000);
    return () => clearInterval(interval);
  }, [text, mode, detector, translator, sourceLang, targetLang]);

  // Copy translated text to clipboard.
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Handle mode change.
  const handleModeChange = (e) => {
    setMode(e.target.value);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-blue-200 flex items-center justify-center p-6">
      <div className="bg-white bg-opacity-80 backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl font-serif font-bold text-center text-indigo-900 mb-4">
          Noble Text Processor
        </h1>
        <p className="text-center text-lg text-gray-700 mb-8">
          Welcome to your unique sanctuary for advanced text processing.
        </p>

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-800">Select Mode:</label>
          <select
            value={mode}
            onChange={handleModeChange}
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="detect">Detect Language</option>
            <option value="translate">Translate</option>
            <option value="summarize">Summarize</option>
          </select>
        </div>

        {/* Translation Language Selectors */}
        {mode === "translate" && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <select
              value={sourceLang}
              onChange={(e) => {
                setSourceLang(e.target.value);
                setTranslator(null);
              }}
              className="flex-1 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
              <option value="ru">Russian</option>
              <option value="tr">Turkish</option>
              <option value="fr">French</option>
            </select>
            {/* Arrow only visible on small screens and up */}
            <div className="hidden sm:flex self-center text-xl">➡️</div>
            <select
              value={targetLang}
              onChange={(e) => {
                setTargetLang(e.target.value);
                setTranslator(null);
              }}
              className="flex-1 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
              <option value="ru">Russian</option>
              <option value="tr">Turkish</option>
              <option value="fr">French</option>
            </select>
          </div>
        )}

        {/* Text Input */}
        <textarea
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
          rows="4"
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
        />

        {/* Loading and Error Feedback */}
        {loading && mode === "detect" && (
          <p className="text-blue-600 text-center mb-4">Loading language model...</p>
        )}
        {loading && mode === "translate" && (
          <p className="text-blue-600 text-center mb-4">
            Loading translation model for {sourceLang.toUpperCase()} to {targetLang.toUpperCase()}...
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        {/* Display Result */}
        {mode === "detect" && result && (
          <div className="text-center text-gray-800 mt-4">
            Based on our analysis, we suggest your text might be written in{" "}
            <span className="font-bold">{result.language}</span> with a confidence of{" "}
            <span className="font-bold">{(result.confidence * 100).toFixed(0)}%</span>.
          </div>
        )}
        {mode === "translate" && result && (
          <div className="p-4 border rounded-lg bg-gray-50 mt-4 relative">
            <h2 className="text-xl font-bold mb-2 text-indigo-900">Translation:</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{result}</p>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
        {mode === "summarize" && result && (
          <div className="p-4 border rounded-lg bg-gray-50 mt-4">
            <h2 className="text-xl font-bold mb-2 text-indigo-900">Summary:</h2>
            <p className="text-gray-800">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
