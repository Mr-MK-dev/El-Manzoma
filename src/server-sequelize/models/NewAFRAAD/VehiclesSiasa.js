const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        "VehiclesSiasa",
        {
            RFardi: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            RGmai: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            SHA: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            Qtal: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            T2meen: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            As3af: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            Warsha: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            Nagda: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            Itfaa: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            Hamr: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            Moghaza: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
            Modr3a: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: "0"
            },
        },
        {
            sequelize,
            tableName: "VehiclesSiasa",
            schema: "dbo",
            timestamps: false
        }
    );
};



// { value: "RFardi", text: "ركوب فردي" },
// { value: "RGmai", text: "ركوب جماعي" },
// { value: "SHA", text: "ش أ" },
// { value: "Qtal", text: "قتال" },
// { value: "T2meen", text: "تامين" },
// { value: "As3af", text: "اسعاف" },
// { value: "Warsha", text: "ورشة" },
// { value: "Nagda", text: "نجدة" },
// { value: "Itfaa", text: "اطفاء" },
// { value: "Hamr", text: "همر" },
// { value: "Moghaza", text: "مجهزة" },
// { value: "Modr3a", text: "مدرعة" },