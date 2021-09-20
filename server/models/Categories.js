module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define("Categories", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        parent: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        }
    });

    Categories.associate = (models) => {
        Categories.hasMany(models.ProductCategories, {
            onDelete: "cascade",
        });
    };

    return Categories;
};