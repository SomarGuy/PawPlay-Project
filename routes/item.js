const { Console } = require('console');
const express = require('express');
const router  = express.Router();
const multer = require('multer');
const path = require ('path');
const db = require ('../db/connection')
const cookieSession = require("cookie-session");

router.use(cookieSession({
  name: "session",
  keys: ["key_1", "key_2"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

//error handler
process.on('uncaughtException', (err) => {
  console.error(err);
  });

//Storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

//Check File Type
const checkFileType = function(file, cb){
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

   if(extname){
    return cb (null,true);
   }else {
    cb("Error: Only jpeg, jpg, or png images are allowed");
   }
}
const upload = multer({
  storage: storage,
  limits: {fileSize: 50000000},
  fileFilter: function (req, file, cb){
    checkFileType(file, cb);
  }
});

// Get products from the database for the current user
router.get("/listing", (req, res) => {
  if (!req.session.user) {
    // Redirect to the login page if the user is not logged in
    return res.redirect('/auth/users/login');
  }

  // Get the user ID from the req.session object
  const userId = req.session.user.id;
  const query = 'SELECT * FROM products WHERE user_id = $1';
  const values = [userId];
  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching products from the database");
    }

    // Render the listing page and pass the products for the current user
    res.render("listing", { products: results.rows, loggedIn: true, req: req });
  });
});

//create a new listing
router.post("/listing", upload.single('image'), (req, res, ) => {
  const name = req.body.name;
  const price = req.body.price;
  const type = req.body.type;
  const description = req.body.description;
  const contact = req.body.contact;
  const image = req.file;
  const userId = req.session.user.id;

  if (!name || !price || !type || !description || !contact || !image) {
    return res.status(400).send("Error: all fields are required");
  }

  if (isNaN(price)) {
    return res.status(400).send("Error: price must be a number");
  }

  // Insert the new product into the database
  const query = `
    INSERT INTO products (name, price, type, description, contact, image, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [name, price, type, description, contact, "/uploads/" + req.file.filename, userId];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving product to the database");
    }

    console.log(results.rows[0]);
    res.redirect("/item/listing");
  });
});

router.post('/listing/:id/delete', (req, res) => {
  // Check if the user is logged in
  if (!req.session.user) {
    return res.status(401).send("You must be logged in to delete a product");
  }

  // Check if the product belongs to the current user
  const productQuery = 'SELECT user_id FROM products WHERE id = $1';
  const productValues = [req.params.id];
  db.query(productQuery, productValues, (err, productResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving product from database");
    }

    // If there is no product with the given ID, return an error
    if (!productResult.rows.length) {
      return res.status(400).send("Product not found");
    }

    // If the product does not belong to the current user, return an error
    if (productResult.rows[0].user_id !== req.session.user.id) {
      return res.status(401).send("You cannot delete a product that does not belong to you");
    }

    // Delete the product if all conditions are met
    const deleteQuery = 'DELETE FROM products WHERE id = $1';
    const deleteValues = [req.params.id];
    db.query(deleteQuery, deleteValues, (err, deleteResult) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error deleting product from database");
      }

      res.redirect("/item/listing");
    });
  });
});

//Route for products available
router.get("/products", (req, res) => {
  const query = `SELECT * FROM products`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).send("Error fetching products from the database");
    }

    res.render("products", { products: results.rows, req: req });
  });
});

module.exports = router;

