'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(
        models.Spot, {
          foreignKey: "ownerId",
          onDelete: "CASCADE",
          hooks: true
        }
      )
      User.hasMany(
        models.Review, {
          foreignKey: "userId",
          onDelete: "CASCADE",
          hooks: true
        }
      )
      User.hasMany(
        models.Booking, {
          foreignKey: "userId",
          onDelete: "CASCADE",
          hooks: true
        }
      )
      User.belongsToMany(
        models.Spot, {
          through: models.Booking,
          foreignKey: "userId",
          otherKey: "spotId"
        }
      )
      User.belongsToMany(
        models.Spot, {
          through: models.Review,
          foreignKey: "userId",
          otherKey: "spotId"
        }
      )
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "User with that email already exists"
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "User with that username already exists"
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword']
        }
      }
    }
  );
  return User;
};
