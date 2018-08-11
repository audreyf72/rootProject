$(document).ready(function() {
  /* global moment */
  // productContainer holds all of our products
  var productContainer = $(".product-container");
  var likedContainer = $(".liked-container");
  var dislikedContainer = $(".disliked-container");
  var productPrefSelect = $("#preference");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.btn3", handleProductDelete);
  $(document).on("click", "button.btn4", handleProductEdit);
  productPrefSelect.on("change", handlePrefChange);
  var products;

  // This function grabs all products from the database and updates all products
  function getProducts(preference) {
    var preferenceString = preference || "";
    if (preferenceString) {
      preferenceString = "/preference/" + preferenceString;
    }
    $.get("/api/products" + preferenceString, function(data) {
      console.log("Products", data);
      products = data;
      if (!products || !products.length) {
        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

  // This function grabs liked products from the database and updates liked products
  function likedProducts(preference) {
    var preferenceString = preference || "";
    if (preferenceString) {
      preferenceString = "/preference/" + preferenceString;
    }
    $.get("/api/products" + preferenceString, function(data) {
      console.log("Products", data);
      products = data;
      if (!products || !products.length) {
        displayEmpty();
      }
      else {
        likedRows();
      }
    });
  }

  // This function grabs disliked products from the database and updates disliked products
  function dislikedProducts(preference) {
    var preferenceString = preference || "";
    if (preferenceString) {
      preferenceString = "/preference/" + preferenceString;
    }
    $.get("/api/products" + preferenceString, function(data) {
      console.log("Products", data);
      products = data;
      if (!products || !products.length) {
        displayEmpty();
      }
      else {
        dislikedRows();
      }
    });
  }

  // This function does an API call to delete products
  function deleteProduct(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/products/" + id
    })
      .then(function() {
        getProducts(productPrefSelect.val());
        likedProducts(productPrefSelect.val());
        dislikedProducts(productPrefSelect.val());
      });
  }

  // Getting the initial list of products
  getProducts();
  likedProducts();
  dislikedProducts();
  // InitializeRows handles appending all of our constructed post HTML inside
  // productContainer
  function initializeRows() {
    productContainer.empty();
    var productsToAdd = [];
    for (var i = 0; i < products.length; i++) {
      productsToAdd.push(createNewRow(products[i]));
    }
    productContainer.append(productsToAdd);
  }

  function likedRows(preference) {
    likedContainer.empty();
    var productsToAdd = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].preference === "liked") {
        productsToAdd.push(createNewRow(products[i]));
      }
      likedContainer.append(productsToAdd);
    }  
  }

  function dislikedRows(preference) {
    dislikedContainer.empty();
    var productsToAdd = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].preference === "disliked") {
        productsToAdd.push(createNewRow(products[i]));
      }
      dislikedContainer.append(productsToAdd);
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

  // This function figures out which post we want to delete and then calls
  // deleteProduct
  function handleProductDelete() {
    var currentProduct = $(this)
      .parent()
      .parent()
      .data("product");
    deleteProduct(currentProduct.id);
  }

  // This function figures out which post we want to edit and takes it to the
  // Appropriate url
  function handleProductEdit() {
    var currentProduct = $(this)
      .parent()
      .parent()
      .data("product");
    window.location.href = "/addproduct?product_id=" + currentProduct.id;
  }

  // This function displays a message when there are no products
  function displayEmpty() {
    productContainer.empty();
    likedContainer.empty();
    dislikedContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No products have been added yet.<br>Please click <a href='/addproduct'>here</a> to add a product.");
    productContainer.append(messageH2);
    likedContainer.append(messageH2);
    dislikedContainer.append(messageH2);
  }

  // This function handles reloading new products when the category changes
  function handlePrefChange() {
    var newProductPreference = $(this).val();
    getProducts(newProductPreference);
    likedProducts(newProductPreference);
    dislikedProducts(newProductPreference);
  }

});
