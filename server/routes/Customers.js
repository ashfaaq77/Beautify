const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const nodemailer = require('nodemailer');

const { Users } = require("../models");
// const { validateRegisterUser, validateDetailsUser, validatePasswordUser, validateDetailsRoleUser } = require("../validation/UserValidation");
const { auth } = require("../middlewares/Auth");
// const { corsAllow } = require("../middlewares/corsAllow");

const router = express.Router();

/**
 * Customer

    get All Customer
 */

/**
 * Get current user details
 */
router.get("/", auth, async (req, res) => {
    const customers = await Users.findAll({
        attributes: ['id', 'email', 'first_name', 'last_name'],
        where: { role: 'customer' }
    });
    res.json(customers);
});


module.exports = router;
