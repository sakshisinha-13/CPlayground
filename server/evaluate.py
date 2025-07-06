import whisper
import sys
import subprocess
import json

# ✅ Safety check for arguments
if len(sys.argv) < 3:
    print("Missing arguments.")
    sys.exit(1)

audio_path = sys.argv[1]
code = sys.argv[2]

# ✅ Transcribe with Whisper
model = whisper.load_model("base")
result = model.transcribe(audio_path)
transcript = result["text"]

# ✅ Prepare prompt
prompt = f"""
You are an AI interviewer. The student wrote the following code:

{code}

And verbally explained:

"{transcript}"

Please evaluate:
- Have they explained the approach?
- Did they mention time and space complexity?
- Did they do a dry run for the first test case?

If everything is correct, say: "Good job!"  
Otherwise, say: "You are good but try improving this..." and give suggestions.

Only reply with the final feedback.
"""

# ✅ Send prompt to Ollama locally
ollama_response = subprocess.run(
    [
        "curl", "-s", "http://localhost:11434/api/generate",
        "-d", json.dumps({
            "model": "gemma3",
            "prompt": prompt
        })
    ],
    stdout=subprocess.PIPE
)

# ✅ Decode Ollama's streaming response
try:
    output = ollama_response.stdout.decode()
    # Sometimes response is in streaming chunks — extract last one
    lines = output.strip().split("\n")
    last_line = lines[-1]
    parsed = json.loads(last_line)
    print(parsed.get("response", "AI didn't return anything useful."))
except Exception as e:
    print("Error parsing Ollama response:", e)
