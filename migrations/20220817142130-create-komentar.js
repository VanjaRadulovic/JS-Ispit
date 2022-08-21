'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) =>  {
    await queryInterface.createTable('Komentars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      body:{
        type: DataTypes.STRING(2048),
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      userId:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      videoId:{
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
    await queryInterface.dropTable('Komentars');
  }
};