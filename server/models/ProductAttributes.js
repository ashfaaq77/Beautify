module.exports = (sequelize, DataTypes) => {
    const ProductAttributes = sequelize.define("ProductAttributes", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        values: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
    });

    return ProductAttributes;
};