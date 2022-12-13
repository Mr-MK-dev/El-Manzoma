module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "userTracking",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "userId"
      },
      queryMethod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "queryMethod"
      },
      tableName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "tableName"
      },
      whereCondition: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "whereCondition"
      },
      changes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "changes"
      },
      beforeChange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "beforeChange"
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "transactionDate"
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "message"
      }
    },
    {
      tableName: "userTracking",
      timestamps: false
    }
  );
};
