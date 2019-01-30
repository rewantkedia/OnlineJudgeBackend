const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.promise = Promise;

const question_schema = new Schema({
  question_id: { type: String, required: true, unique: true },
  text: {
    type: String
  },
  test_cases: {
    type: Array
  },
  tags: {
    type: Array,
    default: null
  },
  total_submissions: {
    type: Number,
    default: 0
  },
  correct_submissions: {
    type: Number,
    default: 0
  }
});

const Question = mongoose.model("Question", question_schema);
module.exports = Question;
