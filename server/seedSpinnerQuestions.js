const mongoose = require('mongoose');
const InterviewQuestion = require('./models/InterviewQuestion.js');
require('dotenv').config();

const questions = [
  { category: "DSA", question: "What is the time complexity of merge sort?" },
  { category: "DSA", question: "What is a hash table and how does it work?" },
  { category: "DSA", question: "What is the difference between BFS and DFS?" },
  
  // CS Fundamentals
  { category: "CS", question: "What is the difference between a process and a thread?" },
  { category: "CS", question: "Explain how DNS works when you open a website." },
  { category: "CS", question: "What is virtual memory in operating systems?" },
  
  // HR
  { category: "HR", question: "Tell me about a time you worked in a team." },
  { category: "HR", question: "Describe a challenge you faced and how you overcame it." },
  { category: "HR", question: "Why should we hire you?" },
  { category: "HR", question: "What are your strengths and weaknesses?" }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await InterviewQuestion.insertMany(questions);
  console.log('✅ Inserted mock interview questions');
  process.exit();
});
