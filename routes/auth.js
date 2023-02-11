const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require('../dbConfig');
const db = require ('../db/connection')
const cookieSession = require("cookie-session");

router.use(cookieSession({
  name: "session",
  keys: ["key_1", "key_2"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


router.get('/users/register', (req, res) => {
  res.render("register", { req })
})

router.get('/users/login', (req, res) => {
  res.render("login", { req })
})

// Logout request
router.get("/users/logout", (req, res) => {
  req.session = null;
  console.log("Successful logout, cookie-session:", req.session);
  res.redirect("/auth/users/login");
  });

// Login post request
router.post("/users/login", (req, res) => {
  const { email, password } = req.body;

  pool.query("SELECT * FROM users WHERE email = $1", [email], (error, results) => {
    if (error) {
      console.error(error);
      throw error;
    }

    if (results.rows.length === 0) {
      console.log("Incorrect email or password");
      res.render("login", { error: "Incorrect email or password" });
    } else {
      const user = results.rows[0];

      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          console.error(error);
          throw error;
        }

        if (result) {
          req.session.user = { id: user.id, email: user.email };
          console.log("Successful login, cookie-session:", req.session);
          res.redirect("/item/products");
        } else {
          console.log("Incorrect email or password");
          res.render("login", { error: "Incorrect email or password" });
        }
      });
    }
  });
});

    router.get('/users/dashboard', (req, res) => {
    res.render("dashboard", { user: "Diogo"});
    });

router.get('/users/dashboard', (req, res) => {
  res.render("dashboard", { user: "Diogo"});
})

// Register new user to the database
router.post('/users/register', async (req, res) => {
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
  } else {
    // Check if the email is already registered
    let emailTaken = false;
    let results = await pool.query(
      `SELECT * FROM users
      WHERE email = $1`,
      [email]
    );
    console.log(results.rows);

    if(results.rowCount > 0) {
      emailTaken = true;
      errors.push({message: "Email already registered"});
    }

    // If the email is already registered, render the register page with error message
    if (emailTaken) {
      res.render('register', { errors });
    } else {
      // Hash the password
      let hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      // Insert the new user into the database
      results = await pool.query(
        `INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)`,
        [name, email, hashedPassword]
      );
      console.log(results);

      // Redirect the user to the login page
      res.redirect('/auth/users/login');
    }
  }
});


module.exports = router;
