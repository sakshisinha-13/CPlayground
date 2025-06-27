const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export const getAIResponse = async (code) => {
  try {
    const response = await fetch(`${API}/api/ai/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    return data.feedback;
  } catch (err) {
    console.error("AI fetch error:", err);
    return "❌ Something went wrong getting feedback.";
  }
};
