module.exports = (sequelize, DataTypes) => {
    const ProductImages = sequelize.define("ProductImages", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        originalname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        featured: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    });

    return ProductImages;
};