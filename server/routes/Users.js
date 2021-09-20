const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const nodemailer = require('nodemailer');

const { Users } = require("../models");
const { validateRegisterUser, validateDetailsUser, validatePasswordUser, validateDetailsRoleUser } = require("../validation/UserValidation");
const { auth } = require("../middlewares/Auth");
// const { corsAllow } = require("../middlewares/corsAllow");

const router = express.Router();

/**
 * User

    Login -> done
    Register -> done
    Forgot Password
    Change password
    Change other details -> done
    Current user details
 */

/**
 * Get current user details
 */
router.get("/user", auth, async (req, res) => {
    const existingUser = await Users.findOne({ where: { id: req.user } });
    res.json(existingUser);
});

/**
 * Get All user 
 */
router.get("/user/all", auth, async (req, res) => {
    const users = await Users.findAll({
        attributes: ['id', 'email', "first_name", 'last_name', 'role']
    });

    res.json(users);
});

/**
 * Get user id details
 */
router.get("/user/:id", auth, async (req, res) => {
    const user = await Users.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'email', "first_name", 'last_name', 'role']
    });
    res.json(user);
});

/**
 * Get user id role
 */
router.get("/user/:id/role", auth, async (req, res) => {
    const user = await Users.findOne({
        where: { id: req.params.id },
        attributes: ['role']
    });
    res.json(user);
});

/**
 * User/admin Register
 */
router.post("/", async (req, res) => {
    try {

        if (!req.body.email || !req.body.password || !req.body.passwordVerify || !req.body.first_name || !req.body.last_name) {
            return res
                .status(200)
                .json({ error: "Please enter all required fields." });
        }

        // validation
        const { value, error } = validateRegisterUser(req.body);
        const { email, password, passwordVerify, first_name, last_name } = value;

        if (error != null) {
            error.details = error.details.map((e) => {
                return e.message;
            });

            return res
                .status(200)
                .json(error.details);
        }

        if (password !== passwordVerify) {
            return res.status(200).json({
                error: "Please enter the same password twice.",
            });
        }

        const existingUser = await Users.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(200).json({
                error: "An account with this email already exists.",
            });
        }
        // hash the password

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // save a new user account to the db

        const newUser = new Users({
            password: passwordHash,
            first_name: last_name,
            last_name: first_name,
            email: email
        });

        const savedUser = await newUser.save();


        // send the token in a HTTP-only cookie
        res.status(200)
            .json({
                'message': 'success',
                'user': savedUser.id
            });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

/**
 * User/admin Log IN
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate
        if (!email || !password) {
            return res
                .status(200)
                .json({ error: "Please enter all required fields." });
        }

        const existingUser = await Users.findOne({ where: { email: email } });
        if (!existingUser) {
            return res.status(200).json({ error: "Wrong email or password." });
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!passwordCorrect) {
            return res.status(200).json({ error: "Wrong email or password." });
        }

        // sign the token
        const token = jwt.sign(
            {
                user: existingUser.id,
                timeProcess: Date.now()
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION_TIME
            }
        );

        // send the token in a HTTP-only cookie
        res
            .cookie("token", token, {
                httpOnly: true,
                expire: process.env.COOKIE_EXPIRATION + Date.now(),
                secure: true,
                sameSite: "none",
            })
            .send();
    } catch (err) {
        console.error(err);
        // res.status(500).send();
        return res.status(401).json({ error: "User not found." });
    }
});

/**
 * Edit user details after login
 */
router.post("/user/details", auth, async (req, res) => {
    try {

        if (!req.body.email || !req.body.first_name || !req.body.last_name) {
            return res
                .status(200)
                .json({ error: "Please enter all required fields." });
        }

        // validation
        const { value, error } = validateDetailsUser(req.body);
        const { email, first_name, last_name } = value;

        if (error != null) {
            error.details = error.details.map((e) => {
                return e.message;
            });

            return res
                .status(200)
                .json(error.details);
        }

        const existingUser = await Users.findOne({ where: { email: email } });
        if (!existingUser) {
            return res.status(200).json({
                error: "No account with this email exists.",
            });
        }

        existingUser.email = email;
        existingUser.first_name = first_name;
        existingUser.last_name = last_name;

        await existingUser.save();

        // send the token in a HTTP-only cookie
        res.status(200)
            .json({
                'message': 'success',
                'user': existingUser.id
            });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

/**
 * Edit user password after login
 */
router.post("/user/:id/password", auth, async (req, res) => {
    try {

        const id = req.params.id;

        if (!req.body.password || !req.body.passwordVerify) {
            return res
                .status(200)
                .json({ error: "Please enter all required fields." });
        }

        // validation
        const { value, error } = validatePasswordUser(req.body);
        const { password, passwordVerify } = value;

        if (error != null) {
            error.details = error.details.map((e) => {
                return e.message;
            });

            return res
                .status(200)
                .json(error.details);
        }

        if (password !== passwordVerify) {
            return res.status(200).json({
                error: "Please enter the same password twice.",
            });
        }

        // const userid = req.user;

        const existingUser = await Users.findOne({ where: { id: id } });
        if (!existingUser) {
            return res.status(200).json({
                error: "No account with this email exists.",
            });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        existingUser.password = passwordHash;

        await existingUser.save();

        // send the token in a HTTP-only cookie
        res.status(200)
            .json({
                'message': 'success',
                'user': existingUser.id
            });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});


/**
 * Log out
 */
router.get("/logout", (req, res) => {
    res
        .cookie("token", "", {
            httpOnly: true,
            expire: new Date(0),
            secure: true,
            sameSite: "none",
        })
        .json({
            message: "success"
        });
});


/**
 * Check Logged IN
 */

router.get("/loggedIn", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const existingUser = await Users.findOne({ where: { id: verified.user } });
        req.user = existingUser;
        res.json({
            user: req.user,
            status: true
        });
    } catch (err) {
        res.json(false);
    }
});


/**
 * Update User Role
 */
router.post("/user/role", auth, async (req, res) => {
    try {

        if (!req.body.role || !req.body.userid) {
            return res
                .status(200)
                .json({ error: "Please enter all required fields." });
        }

        // validation
        const { value, error } = validateDetailsRoleUser(req.body);
        const { role, userid } = value;

        if (error != null) {
            error.details = error.details.map((e) => {
                return e.message;
            });

            return res
                .status(200)
                .json(error.details);
        }

        const existingUser = await Users.findOne({ where: { id: userid } });
        if (!existingUser) {
            return res.status(200).json({
                error: "No account with this email exists.",
            });
        }

        existingUser.role = role;

        await existingUser.save();

        // send the token in a HTTP-only cookie
        res.status(200)
            .json({
                'message': 'success',
                'user': existingUser.id
            });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/users/ashfaaq', async (req, res) => {


    const id = 2;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    res.status(200).json({
        passwordHash
    });
})

module.exports = router;
