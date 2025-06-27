// components/QuestionList.jsx
// -----------------------------------------------------------------------------
// Displays a list of filtered questions in a card-style layout.
// - Clickable cards navigate to the Playground page with question details.
// - Each question can be ticked/unticked using a checkbox.
// - Shows status badges like "Solved" / "Unsolved".
// -----------------------------------------------------------------------------

import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuestionList({
  filteredQuestions = [],
  tickedQuestions = {},
  toggleTick,
}) {
  const navigate = useNavigate();

  const handleClick = (q, index) => {
    const title = q.title || `Question ${index + 1}`;

    navigate(`/playground/${encodeURIComponent(title)}`, {
      state: {
        title: q.title,
        description: q.description,
        inputFormat: q.inputFormat,
        outputFormat: q.outputFormat,
        constraints: q.constraints,
        examples: q.examples,
        testCases: q.testCases,
        difficulty: q.difficulty,
        topic: q.topic,
        year: q.year,
        type: q.type,
        link: q.link,
      },
    });
  };

  // 🧾 No questions to show
  if (filteredQuestions.length === 0) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-300">
        No questions found.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredQuestions.map((q, index) => {
        const key = q.link || `${q.title}-${index}`; // ✅ Safe unique key
        const isTicked = tickedQuestions[key];
        const title = q.title || `Question ${index + 1}`;
        const difficulty = q.difficulty || "Unknown";
        const topic = q.topic || "N/A";

        return (
          <div
            key={key}
            className={`p-4 rounded shadow cursor-pointer ${
              isTicked
                ? "bg-green-100 dark:bg-green-800"
                : "bg-white dark:bg-gray-800"
            } hover:bg-gray-200 dark:hover:bg-gray-700`}
            onClick={() => handleClick(q, index)}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold break-words max-w-[90vw]">
                {title}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    isTicked
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {isTicked ? "Solved" : "Unsolved"}
                </span>
                <input
                  type="checkbox"
                  checked={!!isTicked}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleTick(key)} // ✅ Uses safe key
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Difficulty: {difficulty}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase mt-1">
              Topic: {topic}
            </p>
          </div>
        );
      })}
    </div>
  );
}
