$(document).ready(function() {
  // Getting jQuery references to the post body, title, form, and author select
  var descInput = $("#description");
  var nameInput = $("#name");
  var prefInput = $("#preference");
  var ratingInput = $("#rating");
  var addProductForm = $("#newProduct");
  var userSelect = $("#user");
  // Adding an event listener for when the form is submitted
  $(addProductForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a product)
  var url = window.location.search;
  var productId;
  var userId;
  // Sets a default for whether or not we're updating a product to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the product id from the url
  // In '?product_id=1', productId is 1
  if (url.indexOf("?product_id=") !== -1) {
    productId = url.split("=")[1];
    getProductData(productId, "product");
  }
  // Otherwise if we have an user_id in our url, preset the user select box to be the present user
  else if (url.indexOf("?user_id=") !== -1) {
    userId = url.split("=")[1];
  }

  // Getting the users, and their products
  getUsers();

  // A function for handling what happens when the form to create a new product is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a description, name, or user
    if (!nameInput.val().trim() || !descInput.val().trim() || !userSelect.val()) {
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
        .val(),
      rating: ratingInput
        .val(),
      UserId: userSelect.val()
    };

    // If we're updating a post run updateProduct to update a post
    // Otherwise run submitProduct to create a whole new post
    if (updating) {
      newProduct.id = productId;
      updateProduct(newProduct);
    }
    else {
      submitProduct(newProduct);
    }
  }

  // Submits a new product and brings user to allproducts page upon completion
  function submitProduct(product) {
    $.post("/api/products", product, function() {
      window.location.href = "/allproducts";
    });
  }

  // Gets product data for the current product if we're editing, or if we're adding to a user's existing products
  function getProductData(id, type) {
    var queryUrl;
    switch (type) {
    case "product":
      queryUrl = "/api/products/" + id;
      break;
    case "user":
      queryUrl = "/api/users/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.UserId || data.id);
        // If this product exists, prefill our addProduct forms with its data
        nameInput.val(data.product_name);
        descInput.val(data.product_desc);
        prefInput.val(data.preference);
        ratingInput.val(data.rating);
        userId = data.UserId || data.id;
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get users and then render our list of users
  function getUsers() {
    $.get("/api/users", renderUserList);
  }
  // Function to either render a list of user, or if there are none, direct the user to the page
  // to create a profile first
  function renderUserList(data) {
    if (!data.length) {
      window.location.href = "/createprofile";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createUserRow(data[i]));
    }
    userSelect.empty();
    console.log(rowsToAdd);
    console.log(userSelect);
    userSelect.append(rowsToAdd);
    userSelect.val(userId);
  }

  // Creates the user options in the dropdown
  function createUserRow(user) {
    var listOption = $("<option>");
    listOption.attr("value", user.id);
    listOption.text(user.name);
    return listOption;
  }

  // Update a given post, bring user to the allproducts page when done
  function updateProduct(product) {
    $.ajax({
      method: "PUT",
      url: "/api/products",
      data: product
    })
      .then(function() {
        window.location.href = "/allproducts";
      });
  }
});
