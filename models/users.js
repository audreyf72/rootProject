/*module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the User model a name of type STRING
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });

  User.associate = function(models) {
    // Associating User with Products
    // When an User is deleted, also delete any associated Products
    User.hasMany(models.Product, {
      onDelete: "cascade"
    });
  };

  return User;
};*/

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the User model a name of type STRING
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
  instanceMethods: {
    generateHash: function (password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    },
    validPassword: function (password) {
      return bcrypt.compareSync(password, this.password)
    }
  }
})

return User;
};
