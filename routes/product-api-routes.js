// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the products
  app.get("/api/products", function(req, res) {
    var query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.User
    db.Product.findAll({
      where: query,
      include: [db.User]
    }).then(function(dbProduct) {
      res.json(dbProduct);
    });
  });

  // GET route for getting all of the disliked products ??????
  app.get("/api/products/disliked", function(req, res) {
    var query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, preference with a value of '2'
    db.Product.findAll({
      preference: 'dislike',
      include: [db.User]
    })
    .then(function(dbProduct) {
      res.json(dbProduct);
    });
  });

  // GET route for getting all of the liked products ??????
  app.get("/api/products/liked", function(req, res) {
    var query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, preference with a value of 'like'
    db.Product.findAll({
      preference: 'like',
      include: [db.User]
    })
    .then(function(dbProduct) {
      res.json(dbProduct);
    });
  });

  // Get route for retrieving a single Product
  app.get("/api/products/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.User
    db.Product.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function(dbProduct) {
      res.json(dbProduct);
    });
  });

  // POST route for saving a new product
  app.post("/api/products", function(req, res) {
    db.Product.create(req.body).then(function(dbProduct) {
      res.json(dbProduct);
    });
  });

  // DELETE route for deleting products
  app.delete("/api/products/:id", function(req, res) {
    db.Product.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbProduct) {
      res.json(dbProduct);
    });
  });

  // PUT route for updating products
  app.put("/api/products", function(req, res) {
    db.Product.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbProduct) {
      res.json(dbProduct);
    });
  });
};
