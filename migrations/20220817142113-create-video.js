'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) =>  {
    await queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      relesedate:{
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
          isDate: true
        }
      },
      kanalId:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('Videos');
  }
};