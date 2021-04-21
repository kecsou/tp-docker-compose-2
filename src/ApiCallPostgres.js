const { DataTypes } = require('sequelize');

module.exports = {
  /**
   * 
   * @param {string} POSTGRES_URI 
   */
  getApiCallModel(sequelize) {
    return sequelize.define('apiCall', {
      path: DataTypes.TEXT,
      method: DataTypes.TEXT,
      date: DataTypes.DATE,
    });
  }
}
