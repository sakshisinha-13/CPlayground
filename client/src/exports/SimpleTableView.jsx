import React from "react";
import { useNavigate } from "react-router-dom";

export default function SimpleTableView({ questions }) {
  const navigate = useNavigate();

  return (
    <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border">
      <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700">
        <tr>
          <th className="px-3 py-2">Question</th>
          <th className="px-3 py-2">Type</th>
          <th className="px-3 py-2">Topic</th>
          <th className="px-3 py-2">Difficulty</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q, idx) => {
          const title = q.title || `Question ${idx + 1}`;
          return (
            <tr
              key={idx}
              className="border-b hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() =>
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
                })
              }
            >
              <td className="px-3 py-2 text-blue-500 underline font-medium">
                {title}
              </td>
              <td className="px-3 py-2">{q.type}</td>
              <td className="px-3 py-2">{q.topic}</td>
              <td className="px-3 py-2">{q.difficulty}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
