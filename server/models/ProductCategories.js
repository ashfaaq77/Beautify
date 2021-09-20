module.exports = (sequelize, DataTypes) => {
    const ProductCategories = sequelize.define("ProductCategories", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
    });

    return ProductCategories;
};