import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AceEditor from "react-ace";
import axios from "axios";
import { getAIResponse } from "../api/ai";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import * as ace from "ace-builds";
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.4.14/src-noconflict");
ace.config.setModuleUrl('ace/mode/javascript_worker', 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.14/src-noconflict/worker-javascript.js');
ace.config.setModuleUrl('ace/mode/python_worker', 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.14/src-noconflict/worker-python.js');
ace.config.setModuleUrl('ace/mode/c_cpp_worker', 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.14/src-noconflict/worker-c_cpp.js');

const defaultCodeMap = {
  javascript: `// Write your code here.`,
  python: `# Write your code here.`,
  c_cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code here.
    return 0;
}`
};

const difficultyBadge = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-700",
};

const Playground = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [code, setCode] = useState(defaultCodeMap["c_cpp"]);
  const [language, setLanguage] = useState("c_cpp");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(""); // ✅ AI Feedback
  const [aiLoading, setAiLoading] = useState(false); // ✅ AI loading
  const [customInput, setCustomInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [recordingCancelled, setRecordingCancelled] = useState(false);

  useEffect(() => {
    if (!state || !state.title) navigate("/dashboard");
  }, [state, navigate]);

  // Update code when language changes
  useEffect(() => {
    setCode(defaultCodeMap[language]);
  }, [language]);

  const speakPrompt = async () => {
    const msg = new SpeechSynthesisUtterance(
      "Explain your approach, time and space complexity of this code, and do a dry run on the first example."
    );
    msg.lang = "en-US";

    setSpeaking(true); // 🟡 Show lighter yellow while talking

    msg.onend = async () => {
      setSpeaking(false); // ✅ Reset to normal
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = async () => {
          if (recordingCancelled) {
            setRecordingCancelled(false); // reset flag
            setRecording(false);
            setSpeaking(false);
            setAiLoading(false);
            setMediaRecorder(null);
            return; // don't send audio to server
          }
          const blob = new Blob(chunks, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("audio", blob);
          formData.append("code", code);
          const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
          setAiLoading(true);
          try {
            const res = await fetch(`${API_BASE}/api/evaluate`, {
              method: "POST",
              body: formData,
            });

            const data = await res.json();
            setFeedback(data.feedback);
          } catch (err) {
            setFeedback("Something went wrong while analyzing your explanation.");
          } finally {
            setAiLoading(false);
            setRecording(false);
            setMediaRecorder(null);
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
      } catch (err) {
        alert("Microphone error: " + err.message);
      }
    };

    window.speechSynthesis.speak(msg);
  };
  const cancelExplanation = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setRecordingCancelled(true);
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    if (mediaRecorder?.stream) {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop()); // 🛑 This is important!
    }
    setRecording(false);
    setMediaRecorder(null);
    setFeedback("");
    setAiLoading(false);
  };

  const runCode = async () => {
    setLoading(true);

    try {
      const API_BASE = process.env.REACT_APP_API_BASE;

      let testCases;

      if (customInput.trim()) {
        // ✅ User gave custom input — run only this without expectedOutput
        testCases = [
          {
            input: customInput,
            expectedOutput: "", // Skip comparison
          },
        ];
      } else {
        // ✅ No custom input — use predefined testcases from problem
        const raw = Array.isArray(state.testCases)
          ? state.testCases
          : Array.isArray(state.examples)
            ? state.examples
            : [];

        testCases = raw.map((ex) => ({
          input: ex.input,
          expectedOutput: ex.expectedOutput || ex.output || "",
        }));
      }

      const res = await axios.post(`${API_BASE}/api/code/execute`, {
        code,
        language,
        testCases,
      });

      setResults(res.data);
    } catch (err) {
      console.error("Execution failed:", err);
      setResults([{ actualOutput: "Execution failed." }]);
    }

    setLoading(false);
  };


  const getAIReview = async () => {
    setAiLoading(true);
    const result = await getAIResponse(code);
    setFeedback(result);
    setAiLoading(false);
  };


  if (!state) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">

      {/* LEFT PANEL */}
      <div className="md:w-1/2 p-6 overflow-y-auto h-screen bg-white dark:bg-gray-900 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700">
        <button
          className="mb-4 px-3 py-1 bg-gray-200 dark:bg-gray-200 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-300"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300">{state.title}</h1>

        <div className="flex gap-2 mt-2 text-sm">
          <span className="px-2 py-1 rounded bg-gray-200 uppercase dark:bg-gray-300">{state.topic}</span>
          <span className={`px-2 py-1 rounded ${difficultyBadge[state.difficulty] || "bg-gray-300"}`}>{state.difficulty}</span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">{state.year || "N/A"}</span>
        </div>

        <section className="mt-6 space-y-4 text-sm">
          <div>
            <h2 className="font-semibold text-base dark:text-white">Description:</h2>
            <div className="bg-gray-200 dark:bg-gray-800 dark:text-white p-4 rounded whitespace-pre-wrap">{state.description}</div>
          </div>

          {state.inputFormat && (
            <div>
              <h2 className="font-semibold text-base dark:text-white">Input Format:</h2>
              <div className="bg-gray-200 dark:bg-gray-800 dark:text-white p-3 rounded">{state.inputFormat}</div>
            </div>
          )}

          {state.outputFormat && (
            <div>
              <h2 className="font-semibold text-base dark:text-white">Output Format:</h2>
              <div className="bg-gray-200 dark:bg-gray-800 dark:text-white p-3 rounded">{state.outputFormat}</div>
            </div>
          )}

          {state.constraints && (
            <div>
              <h2 className="font-semibold text-base dark:text-white">Constraints:</h2>
              <div className="bg-gray-200 dark:bg-gray-800 dark:text-white p-3 rounded whitespace-pre-wrap">{state.constraints}</div>
            </div>
          )}

          {Array.isArray(state.examples) && state.examples.length > 0 && (
            <div>
              <h2 className="font-semibold text-base dark:text-white">Examples:</h2>
              <ul className="space-y-2 dark:text-white">
                {state.examples.map((ex, idx) => (
                  <li key={idx} className="bg-gray-200 dark:bg-gray-800 p-3 rounded">
                    <strong>Input:</strong> {ex.input}<br />
                    <strong>Output:</strong> {ex.output}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </section>
      </div>

      {/* RIGHT PANEL */}
      <div className="lg:w-1/2 w-full overflow-y-auto h-screen bg-gray-200 dark:bg-gray-900 text-white rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c_cpp">C++</option>
          </select>
          <button
            onClick={runCode}
            className={`px-4 py-2 rounded mt-2 transition-colors duration-200
    ${loading ? "bg-blue-900 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            disabled={loading}
          >
            {loading ? "Running..." : "Run"}
          </button>
          <button
            onClick={getAIReview}
            className="px-4 py-2 rounded mt-2 bg-purple-600 hover:bg-purple-700 transition disabled:opacity-60"
            disabled={aiLoading}
          >
            {aiLoading ? "Analyzing..." : "AI Feedback"}
          </button>
          {!recording ? (
            <button
              onClick={speakPrompt}
              className={`px-4 py-2 rounded mt-2 transition disabled:opacity-60 text-black 
      ${speaking ? "bg-yellow-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-700"}
    `}
              disabled={aiLoading || speaking}
            >
              🎤 Start Explanation
            </button>
          ) : (
            <button
              onClick={() => { if (mediaRecorder && mediaRecorder.state === "recording") { mediaRecorder.stop(); setRecording(false); } }}
              className="px-4 py-2 rounded mt-2 bg-red-600 hover:bg-red-700 transition text-white"
            >
              🛑 Stop Recording
            </button>

          )}
          {(recording || speaking) && (
            <button
              onClick={cancelExplanation}
              className="px-4 py-2 rounded mt-2 bg-gray-600 hover:bg-gray-700 transition text-white"
            >
              ❌ Cancel Explanation
            </button>
          )}

        </div>

        <AceEditor
          mode={language}
          theme="monokai"
          value={code}
          onChange={(newCode) => setCode(newCode)}
          name="codeEditor"
          fontSize={16}
          width="100%"
          height="300px"
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <div className="mt-4">
          <label className="block text-black dark:text-white font-semibold mb-1">Custom Input (Optional)</label>
          <textarea
            placeholder="Enter input to be given to your code"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            rows={4}
            className="border border-gray-300 text-black bg-white p-2 mt-1 w-full rounded resize-none"
          />
        </div>

        {Array.isArray(results) && results.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-md text-sm space-y-3 max-h-[300px] overflow-y-auto">
            <h3 className="font-bold text-lg">Test Case Results:</h3>
            {results.map((res, idx) => (
              <div key={idx} className={`p-2 rounded ${res.passed === true ? "bg-green-800" : res.passed === false ? "bg-red-900" : "bg-blue-800"}`}>
                <p><strong>Input:</strong> {res.input}</p>
                {/* <p><strong>Expected:</strong> {res.expectedOutput}</p>
                <p><strong>Actual:</strong> {res.actualOutput}</p>
                <p><strong>Status:</strong> {res.status}</p> */}
                <p><strong>Output:</strong> {res.actualOutput}</p>
                {/* ✅ Show Expected and Status only if it's a DB testcase */}
                {res.passed !== null && (
                  <>
                    <p><strong>Expected:</strong> {res.expectedOutput}</p>
                    <p><strong>Status:</strong> {res.status}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {feedback && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded mt-4 text-sm text-black dark:text-white border border-purple-500 whitespace-pre-line">
            <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300 mb-2">💡 AI Feedback:</h3>
            {feedback}
          </div>
        )}

      </div>

    </div>
  );
};

export default Playground;