'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Komentar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User}) {
   
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Komentar.init({
    body:{
      type: DataTypes.STRING(2048),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'Komentar',
  });
  return Komentar;
};