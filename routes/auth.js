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

module.exports = router;
