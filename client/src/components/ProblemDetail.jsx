const speakAndRecord = async () => {
  // Speak first
  const msg = new SpeechSynthesisUtterance(
    "Tell me your approach, time and space complexity of this code, and do a dry run on the first example."
  );
  msg.onend = () => startRecording(); // start recording after voice ends
  window.speechSynthesis.speak(msg);
};

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks = [];

  mediaRecorder.ondataavailable = e => chunks.push(e.data);

  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append("audio", blob);
    formData.append("code", code); // add current code
    const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
    const res = await fetch(`${API_BASE}/api/evaluate`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert("AI says: " + data.feedback);
  };

  mediaRecorder.start();
};

// Add this button inside your return block
<Button onClick={speakAndRecord}>🎤 Explain to AI</Button>
