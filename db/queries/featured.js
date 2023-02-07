const db = require('../connection');

//function returns all featured products
const getProducts = () => {
  return db.query(`SELECT * FROM products where is_sponsored = false`)
  .then((data) => {
    return data.rows;
   })
   .catch((err) => {
     console.log(err.message)
     return err.message
   })
};
module.exports = { getProducts };
// getProducts()
