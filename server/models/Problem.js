// Import mongoose to define schema
const mongoose = require("mongoose");

// Define schema for coding problems
const problemSchema = new mongoose.Schema({
  title: String,               // Problem title
  description: String,         // Full problem description
  inputFormat: String,         // Description of input format
  outputFormat: String,        // Description of output format
  constraints: String,         // Constraints like value ranges
  examples: [                  // Sample input/output shown to user
    {
      input: String,
      output: String,
    },
  ],
  testCases: [                 // Hidden test cases used for judging
    {
      input: String,
      expectedOutput: String,
    },
  ],
  difficulty: String,          // 'Easy' | 'Medium' | 'Hard'
  topic: String,               // e.g., 'dsa', 'os', etc.
  type: String,
  company: String,   
  role: String,      
  yoe: String                     
});

// Export the model
module.exports = mongoose.model("Problem", problemSchema);
