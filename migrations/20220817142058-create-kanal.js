'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Kanals', {
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
      subs:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
          notEmpty: true
        }
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
    await queryInterface.dropTable('Kanals');
  }
};