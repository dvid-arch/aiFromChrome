import React, { useEffect, useState } from "react";
import { ArrowRight, Languages, FileText, FileSearch, Copy, Check, Loader2 } from "lucide-react";
import { initializeLanguageDetector, detectLanguage } from "./util/langDetector";
import { initializeTranslator, translateText } from "./util/translator";

function formatError(message) {
  if (!message) return "";
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("not available")) {
    return "Your device or browser does not support this feature. Please try updating your device or using a different browser.";
  }
  return message;
}

export default function UnifiedTextProcessor() {
  // State management
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
  const [isTyping, setIsTyping] = useState(false);

  // LocalStorage effects
  useEffect(() => localStorage.setItem("utp_text", text), [text]);
  useEffect(() => localStorage.setItem("utp_mode", mode), [mode]);
  useEffect(() => localStorage.setItem("utp_sourceLang", sourceLang), [sourceLang]);
  useEffect(() => localStorage.setItem("utp_targetLang", targetLang), [targetLang]);

  // Typing detection effect
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [text]);

  // Initialize models effect
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

  // Text processing effect
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
          if (!detector) return;
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
          if (!translator) return;
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

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(typeof result === 'string' ? result : result.language);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case "detect": return <Languages className="w-5 h-5" />;
      case "translate": return <ArrowRight className="w-5 h-5" />;
      case "summarize": return <FileText className="w-5 h-5" />;
      default: return <FileSearch className="w-5 h-5" />;
    }
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-emerald-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl max-w-4xl w-full transform transition-all duration-500 hover:shadow-3xl border border-white/20">
        <div className="flex items-center justify-center mb-6 space-x-3">
          {getModeIcon()}
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
           Ai on the Browser. Cool Right!
          </h1>
        </div>
        
        
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="relative group">
            <label className="block mb-2 font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
              Processing Mode
            </label>
            <select
              value={mode}
              onChange={handleModeChange}
              className="w-full p-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm
                         focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50
                         transition-all duration-300 outline-none appearance-none
                         hover:border-purple-300"
            >
              <option value="detect">Detect Language</option>
              <option value="translate">Translate</option>
              <option value="summarize">Summarize</option>
            </select>
          </div>

          {/* Translation Options */}
          {mode === "translate" && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <select
                  value={sourceLang}
                  onChange={(e) => {
                    setSourceLang(e.target.value);
                    setTranslator(null);
                  }}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 bg-white/50
                           focus:border-purple-500 focus:ring focus:ring-purple-200
                           transition-all duration-300 outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="pt">Portuguese</option>
                  <option value="ru">Russian</option>
                  <option value="tr">Turkish</option>
                </select>
              </div>
              
              <div className="hidden sm:flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-purple-500 animate-pulse" />
              </div>
              
              <div className="flex-1">
                <select
                  value={targetLang}
                  onChange={(e) => {
                    setTargetLang(e.target.value);
                    setTranslator(null);
                  }}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 bg-white/50
                           focus:border-purple-500 focus:ring focus:ring-purple-200
                           transition-all duration-300 outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="pt">Portuguese</option>
                  <option value="ru">Russian</option>
                  <option value="tr">Turkish</option>
                </select>
              </div>
            </div>
          )}

          {/* Text Input */}
          <div className="relative">
            <textarea
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white/50
                       focus:border-purple-500 focus:ring focus:ring-purple-200
                       transition-all duration-300 outline-none resize-none
                       hover:border-purple-300 min-h-[160px]"
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError(null);
              }}
            />
            {isTyping && (
              <div className="absolute bottom-3 right-3">
                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
              </div>
            )}
          </div>

          {/* Feedback States */}
          {loading && (
            <div className="flex items-center justify-center space-x-2 text-purple-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading {mode === "detect" ? "language model" : "translation model"}...</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
              {error}
            </div>
          )}

          {/* Results Display */}
          {result && !error && (
            <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 
                          border border-purple-100">
              {mode === 'translate' && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                </div>
              )}

              {mode === "detect" && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-purple-900">Detection Result</h2>
                  <p className="text-gray-700">
                    Detected language:{" "}
                    <span className="font-semibold text-purple-700">{result.language}</span>
                  </p>
                  <div className="w-full bg-purple-100 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-right">
                    Confidence: {(result.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              )}

              {mode === "translate" && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-purple-900">Translation</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
                </div>
              )}

              {mode === "summarize" && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-purple-900">Summary</h2>
                  <p className="text-gray-700">{result}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}