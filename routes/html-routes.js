// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads allproducts.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // addproduct route loads addproduct.html 
  app.get("/addproduct", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/addproduct.html"));
  });

  // allproducts route loads allproducts.html 
  app.get("/allproducts", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/allproducts.html"));
  });

  // liked route loads liked.html 
  app.get("/liked", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/liked.html"));
  });

  // disliked route loads liked.html 
  app.get("/disliked", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/disliked.html"));
  });

  // createprofile route loads login.html
  app.get("/createprofile", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/createprofile.html"));
  });

};
