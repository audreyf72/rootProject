module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    product_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preference: {
      type: DataTypes.STRING,
      defaultValue: "liked"
    },
    rating: {
      type: DataTypes.INTEGER,
    }
  });

//Removed join for user because user is not valid  
/*  Product.associate = function(models) {
    // We're saying that a Product should belong to an User
    // A Product can't be created without an User due to the foreign key constraint
    Product.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };*/

  return Product;
};
