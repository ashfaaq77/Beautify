module.exports = (sequelize, DataTypes) => {
    const UserBilling = sequelize.define("UserBilling", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
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
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address_line_1: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        address_line_2: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        post_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shipping: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
        },
    });

    // Users.associate = (models) => {
    //     Users.hasMany(models.Likes, {
    //         onDelete: "cascade",
    //     });

    //     Users.hasMany(models.Posts, {
    //         onDelete: "cascade",
    //     });
    // };

    return UserBilling;
};
