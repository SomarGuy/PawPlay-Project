const { Console } = require('console');
const express = require('express');
const router  = express.Router();
const multer = require('multer');
const path = require ('path');
const db = require ('../db/connection')

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

// get products from the database
router.get("/listing", (req, res) => {
  const query = `SELECT * FROM products`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).send("Error fetching products from the database");
    }

    res.render("listing", { products: results.rows });
  });
});

//Route for deleting product
router.post('/listing/:id/delete', (req, res) => {
  const query = 'DELETE FROM products WHERE id = $1';
  const values = [req.params.id];
  db.query(query, values, (err, results) => {
  if (err) {
  console.error(err);
  return res.status(500).send("Error deleting product from database");
  }

  res.redirect("/item/listing");
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

  if (!name || !price || !type || !description || !contact || !image) {
    return res.status(400).send("Error: all fields are required");
  }

  if (isNaN(price)) {
    return res.status(400).send("Error: price must be a number");
  }

  // Insert the new product into the database
  const query = `
    INSERT INTO products (name, price, type, description, contact, image)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [name, price, type, description, contact, "/uploads/" + req.file.filename];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving product to the database");
    }

    console.log(results.rows[0]);
    res.redirect("/item/listing");
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

    res.render("products", { products: results.rows });
  });
});

module.exports = router;

