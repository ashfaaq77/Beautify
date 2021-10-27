module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define("OrderItem", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        item_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        item_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        item_qty: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_cost: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        item_attributes: {
            type: DataTypes.JSON,
            allowNull: true
        }
    });

    // Orders.associate = (models) => {
    //     Orders.hasMany(models.UserOrderBilling, {
    //         onDelete: "cascade",
    //     });
    // };

    return OrderItem;
};