// Requiring our model
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the products
  app.get("/api/products/", function(req, res) {
    db.Product.findAll({})
      .then(function(dbProduct) {
        res.json(dbProduct);
      });
  });

  /* Original Get route for returning products of a specific category
  app.get("/api/products/preference/:preference", function(req, res) {
    db.Product.findAll({
      where: {
        preference: req.params.preference
      }
    })
      .then(function(dbProduct) {
        res.json(dbProduct);
      });
  });*/

  // GET route for getting all of the liked products
  app.get("/api/products/liked", function(req, res) {
    db.Product.findAll({
      where: {
        preference: "like"
      }
    })
      .then(function(dbProduct) {
        res.json(dbProduct);
      });
  });

   // GET route for getting all of the disliked products
  app.get("/api/products/disliked", function(req, res) {
    db.Product.findAll({
      where: {
        preference: "dislike"
      }
    })
      .then(function(dbProduct) {
        res.json(dbProduct);
      });
  });

  // Get route for retrieving a single Product
  app.get("/api/products/:id", function(req, res) {
    db.Product.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(function(dbProduct) {
        res.json(dbProduct);
      });
  });

  // POST route for saving a new product
  app.post("/api/products", function(req, res) {
    console.log(req.body);
    db.Product.create({
      product_name: req.body.product_name,
      product_desc: req.body.product_desc,
      preference: req.body.preference,
      rating: req.body.rating
    })
      .then(function(dbProduct) {
        res.json(dbProduct);
      });
  });

  // DELETE route for deleting products
  app.delete("/api/products/:id", function(req, res) {
    db.Product.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(function(dbProduct) {
        res.json(dbProduct);
      });
  });

  // PUT route for updating products
  app.put("/api/products", function(req, res) {
    db.Product.update(req.body,
      {
        where: {
          id: req.body.id
        }
      })
      .then(function(dbProduct) {
        res.json(dbProduct);
      });
  });
};
