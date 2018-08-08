$(document).ready(function() {
  // Getting references to the name input and author container, as well as the table body
  var nameInput = $("#user-name");
  var emailInput = $("#user-email");
  var passwordInput = $("#user-password");
  var userList= $("tbody");
  var userContainer = $(".user-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // a user
  $(document).on("submit", "#user-form", handleUserFormSubmit);
  $(document).on("click", ".delete-user", handleDeleteButtonPress);

  // Getting the initial list of Users
  getUsers();

  // A function to handle what happens when the form is submitted to create a new profile
  function handleUserFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the email field hasn't been filled out
    if (!emailInput.val().trim().trim()) {
      return;
    }
    // Calling the addUser function and passing in the value of the name and email input
    addUser({
      name: nameInput
        .val()
        .trim(),
      email: emailInput
        .val()
        .trim(),
      password: passwordInput
        .val()
        .trim()
    });
  }

  // Function for creating the user then redirects to add product page
  function addUser(userData) {
    $.post("/api/users", userData)
    window.location.href = "/addproduct";
    alert("Hello " + userData.name + "! Please add a new product.");
  }

  // Function for creating a new list row for userss
  function createUserRow(userData) {
    var newTr = $("<tr>");
    newTr.data("user", userData);
    newTr.append("<td>" + userData.name + "</td>");
    newTr.append("<td> " + userData.Products.length + "</td>");
    newTr.append("<td><a href='/allproducts?user_id=" + userData.id + "'>View all Products</a></td>");
    newTr.append("<td><a href='/addproduct?user_id=" + userData.id + "'>Add a Product</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-user'>Delete User</a></td>");
    return newTr;
  }

  // Function for retrieving users and getting them ready to be rendered to the page
  function getUsers() {
    $.get("/api/users", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createUserRow(data[i]));
      }
      renderUserList(rowsToAdd);
      nameInput.val("");
      emailInput.val("");
    });
  }

  // A function for rendering the list of users to the page
  function renderUserList(rows) {
    userList.children().not(":last").remove();
    userContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      userList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no users
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create a profile before you can add a product.");
    userContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("user");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/users/" + id
    })
      .then(getUsers);
  }
});
