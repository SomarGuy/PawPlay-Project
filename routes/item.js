const { Console } = require('console');
const express = require('express');
const router  = express.Router();
const multer = require('multer');
const path = require ('path');

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
    cb("Error: Images Only!");
   }
}
const upload = multer({
  storage: storage,
  limits: {fileSize: 50000000},
  fileFilter: function (req, file, cb){
    checkFileType(file, cb);
  }
});


//test database
const products = [
  {
    name: 'KIPRITII Toy Pack',
    price: 100,
    type: 'toy',
    description: 'Various toys',
    contact: 'jj@yahoo.com',
    image: 'https://m.media-amazon.com/images/I/61crAvki0GL._AC_SL1500_.jpg'
  },
];
router.get("/listing", (req, res) => {
  res.render("listing",  {products} );
});


router.post("/listing", upload.single('image'), (req, res, ) => {
  const name = req.body.name;
  const price = req.body.price;
  const type = req.body.type;
  const description = req.body.description;
  const contact = req.body.contact;
  const image = req.file;



  // Save the product to the database
  const product = {
    name,
    price,
    type,
    description,
    contact,
    image: "/uploads/" + req.file.filename
  };
  products.push(product);
  console.log(product)
  res.redirect("/item/listing");
});

module.exports = router;

