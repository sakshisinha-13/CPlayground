const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['DSA', 'CS', 'HR'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
