import whisper
import sys
import subprocess
import json
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

if len(sys.argv) < 4:
    print("Missing arguments.")
    sys.exit(1)

audio_path = sys.argv[1]
code = sys.argv[2]

# Transcribe
model = whisper.load_model("base")
result = model.transcribe(audio_path)
transcript = result["text"]

prompt = f"""
You are an extremely strict and detail-oriented AI interviewer.

The student wrote the following code:
{code}

And gave this verbal explanation:
"{transcript}"

Your task:
1. Verify if their explanation correctly describes the approach used in the code.
2. Check if they correctly stated time and space complexity. Do NOT assume it's correct—analyze and validate it based on the code.
3. Check if they performed a proper dry run with a test case.

🔒 Rules:
- If any part is incorrect or missing, DO NOT say "Good job."
- Give very specific feedback only based on the explanation. Do NOT assume correctness from code alone.
- Highlight any incorrect time/space complexity mentioned.
- If dry run is missing or flawed, mention it.

🎯 Only return one of the following:
- If everything is correct and clearly explained, return: "✅ Good job!"
- Else, return: "❌ You are good but try improving this..." followed by your detailed suggestions.

Only output the final feedback. Do NOT include summary or extra context.
"""


# Ollama call
ollama_response = subprocess.run(
    [
        "curl", "-s", "http://localhost:11434/api/generate",
        "-d", json.dumps({
            "model": "gemma3",
            "prompt": prompt,
            "stream": False  # ⛳️ Important: disables streaming chunks
        })
    ],
    stdout=subprocess.PIPE
)

# Parse response
try:
    output = ollama_response.stdout.decode("utf-8")
    parsed = json.loads(output)
    response_text = parsed.get("response", "AI didn't return anything useful.")
    
    print(response_text.strip().encode('utf-8', 'ignore').decode())
except Exception as e:
    print("Error talking to Ollama:", str(e))
