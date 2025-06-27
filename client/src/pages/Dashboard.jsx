import { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { exportToCSV } from '../exports/exportCSV';
import { exportToMarkdown } from '../exports/exportMarkdown';
import { exportToPDFmake } from '../exports/exportPDFmake';
import SimpleTableView from '../exports/SimpleTableView';
import QuestionList from '../components/QuestionList';
import Navbar from "../components/Navbar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const topicLabels = {
  dsa: "Data Structures & Algorithms",
  os: "Operating System",
  dbms: "Database Management System",
  oops: "Object Oriented Programming",
  system_design: "System Design",
  behavioral: "HR / Behavioral"
};

const labelToKeyMap = {
  "Data Structures & Algorithms": "dsa",
  "Operating System": "os",
  "Database Management System": "dbms",
  "Object Oriented Programming": "oops",
  "System Design": "system_design",
  "HR / Behavioral": "behavioral"
};

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [yoe, setYoe] = useState('');
  const [assessmentType, setAssessmentType] = useState('');
  const [topic, setTopic] = useState('');
  const [year, setYear] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [simpleView, setSimpleView] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const previousQuery = useRef('');
  const restoredFilters = useRef(false);
  const [tickedQuestions, setTickedQuestions] = useState({});
const [darkMode, setDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark";
});

useEffect(() => {
  document.documentElement.classList.toggle('dark', darkMode);
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);

useEffect(() => {
  const savedFilters = JSON.parse(localStorage.getItem("dashboardFilters"));
  if (savedFilters) {
    setQuery(savedFilters.query || '');
    setRole(savedFilters.role || '');
    setYoe(savedFilters.yoe || '');
    setAssessmentType(savedFilters.assessmentType || '');
    setTopic(savedFilters.topic || '');
    setYear(savedFilters.year || '');
    setDifficulty(savedFilters.difficulty || '');
    restoredFilters.current = true; // ✅ mark that we restored filters
  }
}, []);
useEffect(() => {
  if (restoredFilters.current && query !== '') {
    handleSearch();
    restoredFilters.current = false; // only call once
  }
}, [query, role, yoe, assessmentType, topic, year, difficulty]);
  const handleSearch = async () => {
  const company = query.trim(); // Company name input
  const filters = {
  query: company,
  role,
  yoe,
  assessmentType,
  topic,
  year,
  difficulty,
};

localStorage.setItem("dashboardFilters", JSON.stringify(filters));

  if (!company || previousQuery.current === company) return;

  const url = new URL(`${API}/api/problems`); // Correct endpoint

  // Dynamically append filters
  url.searchParams.append("company", company);
  if (role) url.searchParams.append("role", role);
  if (yoe) url.searchParams.append("yoe", yoe);
  if (assessmentType) url.searchParams.append("type", assessmentType);
  if (topic) url.searchParams.append("topic", labelToKeyMap[topic] || topic);
  if (difficulty) url.searchParams.append("difficulty", difficulty);
  if (year) url.searchParams.append("year", year);

  console.log("Fetching from:", url.toString());

  try {
    const response = await fetch(url);
    const data = await response.json();
    setFilteredQuestions(data);
    const user = JSON.parse(localStorage.getItem("codeplayground-user"));
    const userId=user?._id;

if (userId) {
  const progressRes = await fetch(`${API}/api/progress/${userId}`);
  const progressData = await progressRes.json();

  const tickMap = {};
  progressData.forEach(id => { tickMap[id] = true });
  setTickedQuestions(tickMap);
}

    setNoMatch(data.length === 0);
    previousQuery.current = company;
  } catch (err) {
    console.error("❌ Failed to fetch questions:", err);
    setFilteredQuestions([]);
    setNoMatch(true);
  }
};

const toggleTick = async (questionId) => {
  if (!questionId) return;
   const user = JSON.parse(localStorage.getItem("codeplayground-user"));
    const userId=user?._id;
  const isSolved = !tickedQuestions[questionId];

  setTickedQuestions(prev => ({ ...prev, [questionId]: isSolved }));

  if (userId) {
    await fetch(`${API}/api/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, questionId, isSolved }),
    });
  }
};

  const topicCounts = filteredQuestions.reduce((acc, q) => {
    const label = q.topic || 'General';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const repeatedQuestions = {};
  filteredQuestions.forEach(q => {
    const key = q.link || q.title || '';
    repeatedQuestions[key] = (repeatedQuestions[key] || 0) + 1;
  });

  const hotQuestions = Object.entries(repeatedQuestions)
    .filter(([_, count]) => count > 1)
    .map(([link, count]) => ({ link, count }))
    .sort((a, b) => b.count - a.count);

  const topicNames = Object.keys(topicCounts).sort();
  const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#DB2777', '#8B5CF6', '#14B8A6'];
  const topicColorMap = topicNames.reduce((acc, topic, idx) => {
    acc[topic] = palette[idx % palette.length];
    return acc;
  }, {});

  const chartData = {
    labels: topicNames,
    datasets: [{
      data: topicNames.map(topic => topicCounts[topic]),
      backgroundColor: topicNames.map(topic => topicColorMap[topic]),
      borderWidth: 1
    }]
  };

  return (
    <div className={`min-h-screen px-6 py-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="w-full mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md space-y-6">
          <h1 className="text-2xl font-bold">Search Company</h1>
          <div className="flex flex-wrap gap-4">
            <input
              className="px-4 py-3 flex-1 border rounded-md dark:bg-gray-700 text-lg"
              placeholder="Search Company (e.g., Microsoft)"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button onClick={handleSearch} className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition">
              Search
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-600 rounded-md text-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition"
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            <select value={role} onChange={e => setRole(e.target.value)} className="p-3 border rounded-md dark:bg-gray-700 text-lg">
              <option value="">Select Role</option>
              <option value="Software Engineer">Software Engineer</option>
              
            </select>
            <select value={yoe} onChange={e => setYoe(e.target.value)} className="p-3 border rounded-md dark:bg-gray-700 text-lg">
              <option value="">Years of Experience</option>
              <option value="College Graduate">College Graduate</option>
    
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <select value={assessmentType} onChange={e => setAssessmentType(e.target.value)} className="p-3 border rounded-md dark:bg-gray-700 text-lg">
              <option value="">Select Round</option>
              {/*<option value="OA">Online Assessment</option>*/}
              <option value="Interview">Interview</option>
            </select>
            <select value={topic} onChange={e => setTopic(e.target.value)} className="p-3 border rounded-md dark:bg-gray-700 text-lg">
              <option value="">All Topics</option>
              {Object.keys(topicLabels).map(k => (
                <option key={k} value={topicLabels[k]}>{topicLabels[k]}</option>
              ))}
            </select>
            <select value={year} onChange={e => setYear(e.target.value)} className="p-3 border rounded-md dark:bg-gray-700 text-lg">
              <option value="">All Years</option>
              {["2024"].map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="p-3 border rounded-md dark:bg-gray-700 text-lg">
              <option value="">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select> 
          </div>
        </div>

        {filteredQuestions.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md space-y-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <button onClick={() => exportToCSV(filteredQuestions)} className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition">CSV</button>
              <button onClick={() => exportToMarkdown(filteredQuestions)} className="bg-yellow-500 text-black px-6 py-3 rounded-md text-lg font-semibold hover:bg-yellow-600 transition">Markdown</button>
              <button onClick={() => exportToPDFmake(filteredQuestions)} className="bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition">PDF</button>
              <button onClick={() => setSimpleView(!simpleView)} className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition">
                {simpleView ? 'Detailed View' : 'Table View'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-md p-6 shadow-md lg:col-span-3">
                {simpleView ? <SimpleTableView questions={filteredQuestions} /> : <QuestionList filteredQuestions={filteredQuestions} tickedQuestions={tickedQuestions} toggleTick={toggleTick} />}
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-md p-6 shadow-md space-y-8">
                <div>
                  <h3 className="font-bold mb-3 text-center">Questions by Topic</h3>
                  <div className="h-[320px]">
                    <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </div>

                <div className="bg-blue-200 dark:bg-blue-900 p-4 rounded-md">
                  <h3 className="font-bold mb-2">📌 Company Insights</h3>
                  <p className="text-sm">
                    {query.trim()} {role} {assessmentType}:{' '}
                    {Object.entries(topicCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([topic, count]) => `${((count / filteredQuestions.length) * 100).toFixed(0)}% ${topic}`)
                      .join(', ')}
                  </p>
                </div>

                {assessmentType === 'Interview' && (
                  <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-md max-h-44">
                    <h3 className="font-bold mb-2">📆 Year-wise Frequency</h3>
                    <ul className="text-sm list-disc pl-5">
                      {[...new Set(filteredQuestions.map(q => q.year).filter(Boolean))].sort().map(yr => (
                        <li key={yr}>{yr}: {filteredQuestions.filter(q => q.year === yr).length} question(s)</li>
                      ))}
                    </ul>
                  </div>
                )}

                {hotQuestions.length > 0 && (
                  <div className="bg-red-300 dark:bg-red-400 p-4 rounded-md max-h-44">
                    <h3 className="font-bold mb-2">🔥 Most Repeated Questions</h3>
                    <ul className="text-sm list-disc pl-5">
                      {hotQuestions.map((q, idx) => (
                        <li key={idx}><a href={q.link} target="_blank" rel="noreferrer" className="text-indigo-900 underline break-words max-w-[90vw] text-lg">{q.link}</a> – {q.count} times</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-300 p-4 rounded-md text-center font-semibold">
            No questions found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
