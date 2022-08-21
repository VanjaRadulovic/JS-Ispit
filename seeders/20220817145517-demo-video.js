'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
      await queryInterface.bulkInsert('Videos', [
      {
        name: 'Smesni Klipovi',
        kanalId: 1,
        userId: 1,
        relesedate:'24.07.2000'
      },
      {
        name: 'Smesni Klipovi2',
        kanalId: 1,
        userId: 1,
        relesedate:'28.07.2000'
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
