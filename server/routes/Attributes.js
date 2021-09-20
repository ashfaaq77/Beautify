const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Attributes } = require("../models");
const { auth } = require("../middlewares/Auth");
const { validateAttributes } = require("../validation/AttributesValidation");

const router = express.Router();

/**
 * Add Attributes
 */
router.post("/:id", auth, async (req, res) => {
    try {

        if (!req.body.name || !req.body.type) {
            return res
                .status(200)
                .json({ error: "Please enter all required fields." });
        }

        if (req.body.type == 'text') {
            req.body.values = "";
        }

        console.log(req.body.values);
        // validation
        const { value, error } = validateAttributes(req.body);
        const { name, type, values } = value;

        if (error != null) {
            error.details = error.details.map((e) => {
                return e.message;
            });

            return res
                .status(200)
                .json(error.details);
        }

        var savedAttribute = '';
        if (req.params.id > 0) {
            const attribute = await Attributes.findOne({ where: { id: req.params.id } });
            attribute.name = name;
            attribute.type = type;
            if (type == 'text') {
                attribute.values = '';
            } else {
                attribute.values = values;
            }
            savedAttribute = await attribute.save();
        } else {
            const attribute = new Attributes({
                name: name,
                type: type,
                values: values,
            });
            savedAttribute = await attribute.save();
        }

        // send the token in a HTTP-only cookie
        res.status(200)
            .json({
                'message': 'success',
                'attribute': savedAttribute.id
            });
    } catch (err) {
        res.status(500).send();
    }
});

/**
 * Get Attribute by ID
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;

        const attribute = await Attributes.findOne({
            where: {
                'id': id,
            }
        });

        res.status(200)
            .json({
                'message': 'success',
                'attribute': attribute
            });
    } catch (err) {
        res.status(500).send();
    }
});



// router.get("/all", auth, async (req, res) => {
//     try {

//         const attributes = await Attributes.findAll({
//             attributes: ['id', 'name', 'type']
//         })

//         console.log(attributes);
//         res.json(attributes);
//     } catch (err) {
//         res.status(500).send();
//     }
// });

/**
 * Get All attributes
 */
router.get("/", async (req, res) => {
    try {

        const attributes = await Attributes.findAll({
            attributes: ['id', 'name', 'type', 'values']
        })

        res.json(attributes);
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;
