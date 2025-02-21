import React, { useEffect, useState } from "react";
import { initializeLanguageDetector, detectLanguage } from "./util/langDetector";
import { initializeTranslator, translateText } from "./util/translator";

function isDeviceError(message) {
  if (!message) return false;
  return message.toLowerCase().includes("not available");
}

function formatError(message) {
  if (!message) return "";
  return message;
}

// A simple Icon component to replace lucide-react icons.
const Icon = ({ name, className }) => {
  const icons = {
    ArrowRight: <span className={className}>→</span>,
    Languages: <span className={className}>🌐</span>,
    FileText: <span className={className}>📄</span>,
    FileSearch: <span className={className}>🔍</span>,
    Copy: <span className={className}>📋</span>,
    Check: <span className={className}>✔️</span>,
    Loader2: <span className={className}>⏳</span>,
    ExternalLink: <span className={className}>↗️</span>,
  };
  return icons[name] || null;
};

export default function UnifiedTextProcessor() {
  // State management
  const [text, setText] = useState(() => localStorage.getItem("utp_text") || "");
  const [mode, setMode] = useState(() => localStorage.getItem("utp_mode") || "detect");
  const [sourceLang, setSourceLang] = useState(() => localStorage.getItem("utp_sourceLang") || "en");
  const [targetLang, setTargetLang] = useState(() => localStorage.getItem("utp_targetLang") || "fr");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCompatDialog, setShowCompatDialog] = useState(false);
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
    let isMounted = true;

    const initializeModels = async () => {
      setError(null);
      setResult(null);
      setLoading(true);

      try {
        if (mode === "detect") {
          const { detector: newDetector, error: initError } = await initializeLanguageDetector();
          if (!isMounted) return;
          if (initError) {
            setError(formatError(initError));
          } else {
            setDetector(newDetector);
          }
        } else if (mode === "translate" && sourceLang !== targetLang) {
          const { translator: newTranslator, error: initError } = await initializeTranslator(sourceLang, targetLang);
          if (!isMounted) return;
          if (initError) {
            setError(formatError(initError));
          } else {
            setTranslator(newTranslator);
          }
        } else {
          setDetector(null);
          setTranslator(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(formatError(err.message));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeModels();

    return () => {
      isMounted = false;
    };
  }, [mode, sourceLang, targetLang]);

  // Text processing effect
  useEffect(() => {
    if (!text.trim()) {
      setResult(null);
      return;
    }

    let isMounted = true;
    const processTextTimeout = setTimeout(async () => {
      setError(null);
      try {
        if (mode === "detect" && detector) {
          const { results, error: detectError } = await detectLanguage(detector, text);
          if (!isMounted) return;
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
          if (!isMounted) return;
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
        if (!isMounted) return;
        setError(formatError(err.message));
        setResult(null);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(processTextTimeout);
    };
  }, [text, mode, detector, translator, sourceLang, targetLang]);

  // Copy to clipboard handler
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(typeof result === 'string' ? result : result.language);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Returns an icon based on the selected mode
  const getModeIcon = () => {
    switch (mode) {
      case "detect":
        return <Icon name="Languages" className="w-5 h-5" />;
      case "translate":
        return <Icon name="ArrowRight" className="w-5 h-5" />;
      case "summarize":
        return <Icon name="FileText" className="w-5 h-5" />;
      default:
        return <Icon name="FileSearch" className="w-5 h-5" />;
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
            AI on the Browser. Cool Right!
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
              className="w-fit p-3 rounded-xl border-2 border-gray-200 bg-white/50   
                         focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50
                         transition-all duration-300 outline-none 
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
                <Icon name="ArrowRight" className="w-6 h-6 text-purple-500 animate-pulse" />
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
                <Icon name="Loader2" className="w-5 h-5 text-purple-500 animate-spin" />
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center space-x-2 text-purple-600">
              <Icon name="Loader2" className="w-5 h-5 animate-spin" />
              <span>Loading {mode === "detect" ? "language model" : "translation model"}...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="block mb-2">Error</strong>
              <div className="flex items-center justify-between">
                <span>{error}</span>
                {isDeviceError(error) && (
                  <button
                    onClick={() => setShowCompatDialog(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
                  >
                    Fix Now
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Compatibility Dialog Modal */}
          {showCompatDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Enable Required Features</h2>
                <div className="space-y-4">
                  {mode === "translate" ? (
                    <div>
                      <h3 className="font-semibold">For Translation:</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          Go to{" "}
                          <code className="bg-slate-100 px-2 py-1 rounded">
                            chrome://flags/#translation-api
                          </code>
                        </li>
                        <li>
                          Select <strong>Enabled</strong>
                          <ul className="ml-6 mt-1">
                            <li>
                              To try more language pairs, select{" "}
                              <strong>Enabled without language pack limit</strong>
                            </li>
                          </ul>
                        </li>
                        <li>
                          Click <strong>Relaunch</strong> or restart Chrome
                        </li>
                      </ol>
                    </div>
                  ) : mode === "detect" ? (
                    <div>
                      <h3 className="font-semibold">For Language Detection:</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          Go to{" "}
                          <code className="bg-slate-100 px-2 py-1 rounded">
                            chrome://flags/#language-detection-api
                          </code>
                        </li>
                        <li>Select <strong>Enabled</strong></li>
                        <li>
                          Click <strong>Relaunch</strong> or restart Chrome
                        </li>
                      </ol>
                    </div>
                  ) : null}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCompatDialog(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <a
                    href={
                      mode === "translate"
                        ? "chrome://flags/#translation-api"
                        : "chrome://flags/#language-detection-api"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowCompatDialog(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                  >
                    Open Settings
                    <Icon name="ExternalLink" className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}


          {/* Results Display */}
          {result && !error && (
            <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
              {mode === "translate" && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Icon name="Check" className="w-5 h-5 text-green-600" />
                    ) : (
                      <Icon name="Copy" className="w-5 h-5 text-purple-600" />
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
