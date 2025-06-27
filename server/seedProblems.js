// seedProblems.js
// Inserts categorized DSA Interview questions into MongoDB Atlas

const mongoose = require("mongoose");
const Problem = require("./models/Problem");
require("dotenv").config();

const sampleProblems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    inputFormat: "nums = [2,7,11,15], target = 9",
    outputFormat: "Output: [0,1]",
    constraints: `2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.`,
    examples: [
      {
        input: "3\n3 2 4\n6",
        output: "[1,2]"
      },
      {
        input: "2\n3 3\n6",
        output: "[0,1]"
      }
    ],
    testCases: [
      {
        input: "4\n2 7 11 15\n9",
        expectedOutput: "[0,1]"
      },
      {
        input: "3\n3 2 4\n6",
        expectedOutput: "[1,2]"
      },
      {
        input: "2\n3 3\n6",
        expectedOutput: "[0,1]"
      }
    ],
    difficulty: "Easy",
    topic: "dsa",
    type: "Interview",
    company: "Microsoft",
    role: "Software Engineer",
    yoe: "College Graduate"
  },
  {
    title: "Word Ladder",
    description: "Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
    inputFormat: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
    outputFormat: "5",
    constraints: "1 <= beginWord.length <= 10\nendWord.length == beginWord.length\n1 <= wordList.length <= 5000\nwordList[i].length == beginWord.length\nbeginWord, endWord, and wordList[i] consist of lowercase English letters\nbeginWord != endWord\nAll the words in wordList are unique",
    examples: [
      {
        input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        output: "5"
      },
      {
        input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        output: "0"
      }
    ],
    testCases: [
      {
        input: "hit cog 6\\nhot dot dog lot log cog",
        expectedOutput: "5"
      },
      {
        input: "hit cog 5\\nhot dot dog lot log",
        expectedOutput: "0"
      }
    ]
    ,
    difficulty: "Hard",
    topic: "dsa",
    type: "Interview",
    company: "Microsoft",
    role: "Software Engineer",
    yoe: "College Graduate"
  },
  {
  title: "Generate Parentheses",
  description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
  inputFormat: "n (e.g., 3)",
  outputFormat: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
  constraints: "1 <= n <= 8",
  examples: [
    {
      input: "3",
      output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]"
    },
    {
      input: "1",
      output: "[\"()\"]"
    }
  ],
  testCases: [
    {
      input: "2",
      expectedOutput: "[\"(())\",\"()()\"]"
    },
    {
      input: "4",
      expectedOutput: "[\"(((())))\",\"((()()))\",\"((())())\",\"((()))()\",\"(()(()))\",\"(()()())\",\"(()())()\",\"(())(())\",\"(())()()\",\"()((()))\",\"()(()())\",\"()(())()\",\"()()(())\",\"()()()()\"]"
    }
  ],
  difficulty: "Medium",
  topic: "dsa",
  type: "Interview",
  company: "Microsoft",
  role: "Software Engineer",
  yoe: "College Graduate"
},
  {
    title: "Check for Majority Element in a Sorted Array",
    description: "Given an array arr of N elements, a majority element is one that appears more than N/2 times. Write a function `isMajority()` that returns true if the given element is a majority element in the sorted array.",
    inputFormat: "First line contains N followed by N integers, and x as the last value.",
    outputFormat: "True or False",
    constraints: "1 ≤ N ≤ 10^5, Array must be sorted.",
    examples: [
      {
        input: "7\\n1 2 3 3 3 3 10\\n1",
        output: "False"
      },
      {
        input: "8\\n1 1 2 4 4 4 6 6\\n4",
        output: "False"
      }
    ],
    testCases: [
      { input: "7\\n2 2 2 2 3 4\\n1", expectedOutput: "False" },
      { input: "8\\n5 5 5 6 6 7 8\\n6", expectedOutput: "False" }
    ],
    difficulty: "Easy",
    topic: "dsa",
    type: "Interview",
    company: "Microsoft",
    role: "Software Engineer",
    yoe: "College Graduate"
  },
 {
  title: "Longest Increasing Consecutive Subsequence",
  description: "Given N elements, write a program that prints the length of the longest increasing consecutive subsequence. Two consecutive elements in the subsequence must differ by 1.",
  inputFormat: "First line contains N followed by the N array elements.",
  outputFormat: "Length of the longest increasing consecutive subsequence",
  constraints: "1 ≤ N ≤ 10^5, -10^9 ≤ a[i] ≤ 10^9",
  examples: [
    {
      input: "10 3 10 3 11 4 5 6 7 8 12",
      output: "6"
    },
    {
      input: "8 6 7 8 3 4 5 9 10",
      output: "5"
    }
  ],
  testCases: [
    { input: "5 1 2 3 10 20", expectedOutput: "3" },
    { input: "6 4 5 6 1 2 3", expectedOutput: "3" }
  ],
  difficulty: "Easy",
  topic: "dsa",
  type: "Interview",
  company: "Microsoft",
  role: "Software Engineer",
  yoe: "College Graduate"
}

];

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Problem.deleteMany({});
     await Problem.insertMany(sampleProblems);
    console.log("✅ Problems seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};


start();
