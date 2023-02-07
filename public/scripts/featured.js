// const userQueries = require('../db/queries/featured');

$(document).ready(() => {
  loadProducts();
});

const createElement = function(element){
  console.log(element)
  return $(`<section class = "products">
  <p>${element.image}</p>
  <section>
    <p>${element.name}</p>
    <section>
      <p>${element.description}</p>
    </section>
    <footer>
      <p>${element.price}</p>
      <p>
        <i>add to fav</i>
        <i>message seller</i>
      </p>
    </footer>
  </section>
</section>`)
}
const renderProducts = function(items){
  const container = $('.products-container');
  container.empty();
  console.log(items)
  for (let user_data of items.users){
    const $product = createElement(user_data);
    container.append($product);

  }
}

const loadProducts = function(){
  $.ajax('/api/featured', {method: 'GET'})
    .then (data => {
      renderProducts(data);
    })
}
