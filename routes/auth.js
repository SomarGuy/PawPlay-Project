const express = require('express');
const router  = express.Router();

router.get('/users/register', (req, res) => {
  res.render("register")
})

router.get('/users/login', (req, res) => {
  res.render("login")
})

router.get('/users/dashboard', (req, res) => {
  res.render("dashboard", { user: "Diogo"});
})

router.post('/users/register', (req, res) => {
  let { name, email, password, password2 } = req.body;

  console.log({
    name,
    email,
    password,
    password2
  });

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please fill in all fields"});
  }

  if (password.length < 4){
    errors.push({ message: "Password should be at least 4 cahracters"});
  }

  if(password != password2) {
    errors.push({ message: "Passwords do not match"});
  }

  if(errors.length > 0) {
    res.render("register", { errors });
  }
})

module.exports = router;
