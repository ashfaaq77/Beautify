module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define("Products", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        regular_price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        sale_price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0
        },
        stock: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        pre_orders: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        taxable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    Products.associate = (models) => {
        Products.hasMany(models.ProductAttributes, {
            onDelete: "cascade",
        });

        Products.hasMany(models.ProductCategories, {
            onDelete: "cascade",
        });

        Products.hasMany(models.ProductReviews, {
            onDelete: "cascade",
        });
    };

    return Products;
};