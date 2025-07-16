import whisper
import sys
import subprocess
import json
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

if len(sys.argv) < 3:
    print("Missing arguments.")
    sys.exit(1)

audio_path = sys.argv[1]
question = sys.argv[2]

# Transcribe
model = whisper.load_model("base")
result = model.transcribe(audio_path)
transcript = result["text"]

prompt = f"""
You are a strict and insightful AI interview coach.

The student was asked the following question:
"{question}"

And here is their verbal answer:
"{transcript}"

Your task:
1. Determine if their answer is accurate and complete.
2. If anything is missing or unclear, give specific suggestions.
3. Be concise but constructive.

Return one of the following:
- If the answer is excellent, return: "✅ Good job!"
- Otherwise, return: "❌ Try improving this..." followed by helpful feedback.

Do NOT comment on code or dry run — this is a theoretical question.
"""

# Call Ollama
ollama_response = subprocess.run(
    [
        "curl", "-s", "http://localhost:11434/api/generate",
        "-d", json.dumps({
            "model": "gemma3",
            "prompt": prompt,
            "stream": False
        })
    ],
    stdout=subprocess.PIPE
)

try:
    output = ollama_response.stdout.decode("utf-8")
    parsed = json.loads(output)
    response_text = parsed.get("response", "AI didn't return anything useful.")
    print(response_text.strip().encode('utf-8', 'ignore').decode())
except Exception as e:
    print("Error talking to Ollama:", str(e))
