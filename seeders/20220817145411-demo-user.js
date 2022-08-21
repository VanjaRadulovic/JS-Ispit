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
      await queryInterface.bulkInsert('Users', [
      {
        name: 'John',
        lastname: 'Doe',
        email: 'john@doe.com',
        username: 'jdoe',
        password: '12345',
        admin: true,
        moderator: false,
        creator: false
      },
      {
        name: 'Vanja',
        lastname: 'Radulovic',
        email: 'blabla@bla.com',
        username: 'vanja',
        password: '12345',
        admin: true,
        moderator: false,
        creator: false
      }
    
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
