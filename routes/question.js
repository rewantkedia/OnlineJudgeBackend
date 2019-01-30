const router = require("express").Router();
const Question = require("../database/models/question");

router.get("/", (req, res) => {
  res.json({
    message: "HIT"
  });
});
router.post("/add", (req, res) => {
  const { question_id, text, test_cases } = req.body;
  Question.findOne({ question_id: question_id }, (err, question) => {
    if (err) {
      return res.json({
        message: "DB Error"
      });
    } else if (question) {
      return res.json({
        success: 0,
        message: "QUESTION ID exists. Try a new one"
      });
    }
  }).catch(err => {
    console.log("ERROR HERE", err);
  });
  console.log("PARAMS: ", question_id, text, test_cases);
  //   const new_question = new Question({
  //     question_id: question_id,
  //     text: text,
  //     test_cases: test_cases
  //   });
  //   console.log("question save ", new_question);
  //   new_question.save((err, savedObject) => {
  //     if (err) {
  //       res.json({
  //         success: 0,
  //         message: "Error in storing in the database"
  //       });
  //     } else if (savedObject) {
  //       res.json({
  //         success: 1,
  //         message: "Question stored successfully",
  //         question: savedObject
  //       });
  //     }
  //   });
  Question.create({
    question_id: question_id,
    text: text,
    test_cases: test_cases
  }).then(function(savedObject, err) {
    if (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: "Error in storing in the database"
      });
    } else if (savedObject) {
      return res.json({
        success: 1,
        message: "Question stored successfully",
        question: savedObject
      });
    }
  });
});
module.exports = router;
