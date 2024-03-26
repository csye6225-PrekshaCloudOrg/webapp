module.exports = (sequelize, DataTypes) => {
    const VerificationToken = sequelize.define('VerificationToken', {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verification_URL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sent_date: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });
  
    return VerificationToken;
  };
  