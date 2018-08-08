$(document).ready(function() {
  /* global moment */

  // productContainer holds all of our products
  var productContainer = $(".product-container");
  var likedContainer = $("#liked-container");
  var dislikedContainer = $("#disliked-container");
  var productCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.btn3", handleProductDelete);
  $(document).on("click", "button.btn4", handleProductEdit);
  // Variable to hold our products
  var products;

  // The code below handles the case where we want to get product posts for a specific user
  // Looks for a query param in the url for user_id
  var url = window.location.search;
  var userId;
  if (url.indexOf("?user_id=") !== -1) {
    userId = url.split("=")[1];
    getProducts(userId);
  }
  // If there's no userId we just get all products as usual
  else {
    getProducts();
  }


  // This function grabs products from the database and updates the page
  function getProducts(user) {
    userId = user || "";
    if (userId) {
      userId = "/?user_id=" + userId;
    }
    $.get("/api/products" + userId, function(data) {
      console.log("Products", data);
      products = data;
      if (!products || !products.length) {
        displayEmpty(user);
      }
      else {
        initializeRows();
        likedRows();
        dislikedRows();
      }
    });
  }

// InitializeRows handles appending all of our constructed product HTML inside productContainer
  function initializeRows() {
    productContainer.empty();
    var productsToAdd = [];
    for (var i = 0; i < products.length; i++) {
      productsToAdd.push(createNewRow(products[i]));
    }
    productContainer.prepend(productsToAdd);
  }

  // InitializeRows handles appending all of our constructed product HTML on liked.html NEED TO FIX
  function likedRows(like, products) {
    likedContainer.empty();
    var productsToAdd = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].preference.val === like) {
        productsToAdd.push(createNewRow(products[i]));
    }
    likedContainer.prepend(productsToAdd);
  }
}

  // InitializeRows handles appending all of our constructed product HTML on disliked.html NEED TO FIX
  function dislikedRows(dislike, products) {
    dislikedContainer.empty();
    var productsToAdd = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].preference.val === dislike) {
        productsToAdd.push(createNewRow(products[i]));
    }
    dislikedContainer.prepend(productsToAdd);
  }
}

// This function constructs a products HTML
  function createNewRow(product) {
    var formattedDate = new Date(product.createdAt);
    formattedDate = moment(formattedDate).format("M/D/YYYY");
    var newProductPanel = $("<div>");
    newProductPanel.addClass("product-panel");
    var newProductPanelHeading = $("<div>");
    newProductPanelHeading.addClass("product-heading");
    var deleteBtn = $("<button>");
    deleteBtn.html("<img id='deleteIcon' src='../assets/images/deleteicon.svg'>");
    deleteBtn.addClass("btn3");
    var editBtn = $("<button>");
    editBtn.html("<img id='editIcon' src='../assets/images/editicon.svg'>");
    editBtn.addClass("btn4");
    var newProductName = $("<H4>");
    var newProductDate = $("<p>");
    var newProductPref = $("<p>");
    var newProductRating = $("<p>");
    var newProductDesc = $("<p>");
    var newProductPanelBody1 = $("<div>");
    var newProductPanelBody3 = $("<div>");
    newProductPanelBody1.addClass("product-body1");
    newProductPanelBody3.addClass("product-body3");
    newProductName.text(product.product_name + " ");
    newProductDesc.html("<b>Description: </b>" + product.product_desc);
    newProductPref.html("<b>Preference: </b>" + product.preference);
    newProductRating.html("<b>Rating: </b>" + product.rating + " stars");
    newProductDate.html("<b>Date added: </b>" + formattedDate);
    
    newProductPanelHeading.append(newProductName);
    newProductPanelBody1.append(newProductDate);
    newProductPanelHeading.append(newProductDesc);
    newProductPanelHeading.append(newProductPref);
    newProductPanelBody1.append(newProductRating);
    newProductPanelBody3.append(deleteBtn);
    newProductPanelBody3.append(editBtn);
    
    newProductPanel.append(newProductPanelHeading);
    newProductPanel.append(newProductPanelBody1);
    newProductPanel.append(newProductPanelBody3);
    newProductPanel.data("product", product);
    return newProductPanel;
  }

  // This function does an API call to delete products
  function deleteProduct(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/products/" + id
    })
      .then(function() {
        getProducts(productCategorySelect.val());
      });
  }

  // This function figures out which product we want to delete and then calls deleteProduct
  function handleProductDelete() {
    var currentProduct = $(this)
      .parent()
      .parent()
      .data("product");
    deleteProduct(currentProduct.id);
  }

  // This function figures out which product we want to edit and takes it to the appropriate url
  function handleProductEdit() {
    var currentProduct = $(this)
      .parent()
      .parent()
      .data("product");
    window.location.href = "/addproduct?product_id=" + currentProduct.id;
  }

  // This function displays a message when there are no products
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for User #" + id;
    }
    productContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No products have been added yet" + partial + ".<br>" + "Click <a href='/addproduct" + query +
    "'>here</a> to add a product.");
    productContainer.append(messageH2);
    likedContainer.append(messageH2);
    dislikedContainer.append(messageH2);
  }

});
