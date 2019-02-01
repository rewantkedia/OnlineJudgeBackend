const router = require("express").Router();
const Question = require("../database/models/question");
const request = require("request");
router.get("/", (req, res) => {
  res.json({
    message: "HIT"
  });
});
router.post("/", (req, res) => {
  //   //   console.log("REQ", req);
  //   console.log("REQ PARAMS", req.params);
  //   console.log("REQ BODY ", req.body.a);
  const { question_id } = req.body;
  console.log("QUESTION ID ", question_id);
  Question.findOne({ question_id: question_id }, (err, question) => {
    if (err) {
      return res.json({
        message: "DB Error"
      });
    } else if (question) {
      return res.json({
        success: 1,
        question: question
      });
    } else {
      return res.json({
        success: 0,
        message: "URL invalid"
      });
    }
  }).catch(err => {
    console.log("ERROR HERE", err);
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
router.post("/execute", (req, res) => {
      console.log("REQ", req.body);
      const question_id = req.body.question_id;
      const code = req.body.code;
      Question.findOne({ question_id: question_id }, (err, question) => {
            if (err) {
              return res.json({
                success:0,
                message: "DB Error"
              });
            } 
            else if (question) {
              var program = {
                script: code,
                language: "cpp",
                versionIndex: "0",
                clientId: "e1296a045c8fd205c2bc478cde607bf5",
                clientSecret:
                  "61863b5c2bf62d8898dbb62630a961ec8c14c8e3c6ba2f91759d2d5a391e7b06"
              };
              request(
                {
                  url: "https://api.jdoodle.com/execute",
                  method: "POST",
                  json: program
                },
                function(error, response, body) {
                  console.log("Jdoodle output", body);
                  if(error)
                  {
                    return res.json({
                      success:0
                    })
                  }
                  else if(body.statusCode!==200)
                  {
                    return res.json({
                      success:0
                    })
                  }
                  else{
                       return res.json({
                        success: 1,
                        output: body.output,
                      });

                  }
                  
                }
              );
            } 
            else {
              return res.json({
                success: 0,
                
              });
            }


//     console.log("REQ PARAMS", req.params);
//     console.log("REQ BODY ", req.body.a);
//  const { question_id } = req.body.question_id;
//   const code = req.body.
//   console.log("QUESTION ID ", req.body);
//   
//   }).catch(err => {
//     console.log("ERROR HERE", err);
   });
});

module.exports = router;
