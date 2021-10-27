module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'customer',
        }
    });

    Users.associate = (models) => {
        Users.hasMany(models.UserBilling, {
            onDelete: "cascade",
        });

        Users.hasMany(models.ProductReviews, {
            onDelete: "cascade",
        });

        Users.hasMany(models.OrderNotes, {
            onDelete: "cascade",
        });

    };

    return Users;
};