const express = require("express");
const router = express.Router();
const User = require("../database/models/user");
const passport = require("../passport");

router.post("/", (req, res) => {
  console.log("user signup");

  const { username, password, name, email } = req.body;
  // ADD VALIDATION
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      console.log("User.js post error: ", err);
    } else if (user) {
      res.json({
        success: 0,
        message: "Username Exists"
      });
    } else {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          console.log("Email Check post error: ", err);
        } else if (user) {
          res.json({
            success: 0,
            message: "Email Exists"
          });
        }
      });
      const newUser = new User({
        username: username,
        password: password,
        name: name,
        email: email
      });
      newUser.save((err, savedUser) => {
        if (err) return res.json(err);
        res.json({
          success: 1,
          message: "User Created"
        });
      });
    }
  });
});

router.post("/login", function(req, res, next) {

  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({
        success: 0 ///////defines wrong username or password entered
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return (
        req,
        res.json({
          success: 1,
          user: user
        })
      );
    });
  })(req, res);
});

router.get("/", (req, res, next) => {
  console.log("===== user!!======");
  console.log(req.user);
  if (req.user) {
    res.json({ success: 1, user: req.user.username });
  } else {
    res.json({ success: 0, user: null });
  }
});

router.get("/profile", (req, res, next) => {
  console.log("===== profile!!======");
  console.log("USERNAME", req.user.username);
  if (!req.user) {
    res.json({ success: 0, user: null });
  } else {
    User.findOne({ username: req.user.username }, (err, user) => {
      if (err) {
        res.json({ success: 0, message: "Error DB" });
      } else {
        console.log(user);
        //#I user sending password details as well.Avoid.
        res.json({ success: 1, user: user });
      }
    });
  }
});

router.post("/logout", (req, res) => {
  console.log("logouthere");
  if (req.user) {
    req.logout();
    res.json({ success: 1, message: "logging out" });
  } else {
    res.send({ success: 0, message: "no user to log out" });
  }
});

module.exports = router;
