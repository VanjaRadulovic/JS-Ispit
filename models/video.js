'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Kanal, Komentar, User}) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(Kanal, { foreignKey: 'kanalId', as: 'kanal' });
      this.hasMany(Komentar, { foreignKey: 'videoId', as: 'komentar', onDelete: 'cascade', hooks: true  });
      
    }
  }
  Video.init({
    name:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[a-zA-Z\s]*$/i
      }
    },
    relesedate:{
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    kanalId: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,

    }


      
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};



