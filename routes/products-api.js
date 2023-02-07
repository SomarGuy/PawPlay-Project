const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/featured');
console.log(userQueries.getProducts())
router.get('/', (req, res) => {
  userQueries.getProducts()

    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
