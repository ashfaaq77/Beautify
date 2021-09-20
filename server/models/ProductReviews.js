module.exports = (sequelize, DataTypes) => {
    const ProductReviews = sequelize.define("ProductReviews", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
    });

    return ProductReviews;
};