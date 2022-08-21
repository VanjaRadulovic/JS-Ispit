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
      await queryInterface.bulkInsert('Kanals', [
      {
        id: 1,
        name: 'Komedija',
        subs: 0
      },
      {
        id: 2,
        name: 'Vesti',
        subs: 0
      },
      {
        id: 3,
        name: 'Filmovi',
        subs: 0
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
