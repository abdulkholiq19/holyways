'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      donation.belongsTo(models.fund, {
        as: "fund",
        foreignKey: {
          name: "idFund",
        },
      });
      donation.belongsTo(models.user, {
        as: "usersDonate",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  };
  donation.init({
    idFund: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    donateAmount: DataTypes.INTEGER,
    status: DataTypes.STRING,
    proofAttachment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'donation',
  });
  return donation;
};