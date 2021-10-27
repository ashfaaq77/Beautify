module.exports = (sequelize, DataTypes) => {
    const OrderNotes = sequelize.define("OrderNotes", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    // Orders.associate = (models) => {
    //     Orders.hasMany(models.UserOrderBilling, {
    //         onDelete: "cascade",
    //     });
    // };

    return OrderNotes;
};