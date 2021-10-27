module.exports = (sequelize, DataTypes) => {
    const Orders = sequelize.define("Orders", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
    });

    Orders.associate = (models) => {
        Orders.hasMany(models.UserOrderBilling, {
            onDelete: "cascade",
        });

        Orders.hasMany(models.OrderItem, {
            onDelete: "cascade",
        });

        Orders.hasMany(models.OrderNotes, {
            onDelete: "cascade",
        });

    };

    return Orders;
};