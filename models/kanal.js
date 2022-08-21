'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kanal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Video }) {
      // define association here
    this.hasMany(Video, { foreignKey: 'kanalId', as: 'video', onDelete: 'cascade', hooks: true  });
    }
  };
  Kanal.init({
    name:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[a-zA-Z\s]*$/i
      }
    },
    subs:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      validate: {
        notEmpty: true,
      }
    },


  }, {
    sequelize,
    modelName: 'Kanal',
  });
  return Kanal;
};