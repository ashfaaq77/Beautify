module.exports = (sequelize, DataTypes) => {
    const Attributes = sequelize.define("Attributes", {
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
        values: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "dropdown"
        }
    });

    Attributes.associate = (models) => {
        Attributes.hasMany(models.ProductAttributes, {
            onDelete: "cascade",
        });
    };

    return Attributes;
};