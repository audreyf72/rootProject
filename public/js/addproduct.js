$(document).ready(function() {
  // Gets an optional query string from our url (i.e. ?post_id=23)
  var url = window.location.search;
  var productId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  if (url.indexOf("?product_id=") !== -1) {
    productId = url.split("=")[1];
    getProductData(productId);
  }

  // Getting jQuery references to the product name, description, preference and rating select
  var descInput = $("#description");
  var nameInput = $("#name");
  var prefInput = $("#preference");
  var ratingInput = $("#rating");

  var addProductForm = $("#newProduct");
  var prefSelect = $("#selectpref");
  // Giving the prefSelect a default value
  prefSelect.val("liked");
  // Adding an event listener for when the form is submitted
  $(addProductForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a name or preference
    if (!nameInput.val().trim() || !prefInput.val()) {
      return;
    }
    // Constructing a newProduct object to hand to the database
    var newProduct = {
      product_name: nameInput
        .val()
        .trim(),
      product_desc: descInput
        .val()
        .trim(),
      preference: prefInput
        .val()
        .trim(),
      rating: ratingInput
        .val()
    };

    console.log(newProduct);

    // If we're updating a post run updateProduct to update a post
    // Otherwise run submitProduct to create a whole new post
    if (updating) {
      newProduct.id = productId;
      updateProduct(newProduct);
    }
    else {
      submitProduct(newProduct);
    }
  });

  // Submits a new post and brings user to confirmation page upon completion
  function submitProduct(Product) {
    $.post("/api/products/", Product, function() {
      window.location.href = "/confirm";
    });
  }

  // Gets post data for a post if we're editing
  function getProductData(id) {
    $.get("/api/products/" + id, function(data) {
      if (data) {
        // If this product exists, prefill our add product form with its data
        nameInput.val(data.product_name);
        descInput.val(data.product_desc);
        prefInput.val(data.preference);
        ratingInput.val(data.rating);
        // If we have a product with this id, set a flag for us to know to update the product
        // when we hit submit
        updating = true;
      }
    });
  }

  // Update a product, bring user to the all products page when done
  function updateProduct(product) {
    $.ajax({
      method: "PUT",
      url: "/api/products",
      data: product
    })
      .then(function() {
        window.location.href = "/update";
      });
  }
});
