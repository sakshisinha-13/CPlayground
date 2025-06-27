const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  questionId: {
    type: String,
    required: true
  },
  isSolved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("UserProgress", userProgressSchema);
