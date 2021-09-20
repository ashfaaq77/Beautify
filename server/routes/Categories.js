const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");

const { Categories } = require("../models");
const { auth } = require("../middlewares/Auth");
const { validateCategories } = require("../validation/CategoriesValidation");

const router = express.Router();

/**
 * Add Attributes
 */
router.post("/:id", auth, async (req, res) => {
    try {

        if (!req.body.name || req.body.name >= 0) {
            return res
                .status(200)
                .json({ error: "Please enter all required fields." });
        }

        // validation
        const { value, error } = validateCategories(req.body);
        const { name, parent } = value;

        if (error != null) {
            error.details = error.details.map((e) => {
                return e.message;
            });

            return res
                .status(200)
                .json(error.details);
        }

        let found = false;
        let slug = name;
        let count = 1;
        let originalSlug = name;
        const options = {
            replacement: '-', // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true, // convert to lower case, defaults to `false`
            strict: true, // strip special characters except replacement, defaults to `false`
            locale: 'en', // language code of the locale to use
        };

        while (!found) {
            slug = slugify(slug, options);
            const cat = await Categories.findOne({ where: { slug: slug } });
            if (cat) {
                console.log("found");
                slug = originalSlug + "-" + count;
                count++;
            } else {
                console.log("not found");
                found = true;
            }
        }

        console.log(req.params.id);
        var savedCategories = '';
        if (req.params.id > 0) {
            const category = await Categories.findOne({ where: { id: req.params.id } });
            category.name = name;
            category.parent = parent;
            category.slug = slug;
            console.log(category);
            savedCategories = await category.save();
        } else {
            const category = new Categories({
                name: name,
                parent: parent,
                slug: slug
            });
            savedCategories = await category.save();
        }

        // send the token in a HTTP-only cookie
        res.status(200)
            .json({
                'message': 'success',
                'category': savedCategories.id
            });
    } catch (err) {
        res.status(500).send(err);
    }
});

/**
 * Get Categories by ID
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;

        const category = await Categories.findOne({
            where: {
                'id': id,
            }
        });

        res.status(200)
            .json({
                'message': 'success',
                'category': category
            });
    } catch (err) {
        res.status(500).send();
    }
});


/**
 * Get All categories
 */
router.get("/", auth, async (req, res) => {
    try {

        const categories = await Categories.findAll({
            attributes: ['id', 'name', 'parent'],
            order: [
                ['parent', 'DESC']
            ]
        })

        res.json(categories);
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;
