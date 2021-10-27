const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/Auth");
const path = require('path');
const fs = require("fs");

const { ProductImages } = require("../models");


const router = express.Router();

/**
 * Get current user details
 */
router.get("/:id/images/featured", auth, async (req, res) => {

    console.log(req.params.id);
    try {

        const image = await ProductImages.findOne({
            where: {
                ProductId: req.params.id,
                featured: 1
            }
        });

        res.contentType('image/png');

        fs.readFile(image.destination,
            function (err, content) {
                // Serving the image
                res.end(content);
            }
        );
    } catch (err) {
        res.status(200).send("");
    }
});

router.get("/:id/images/:imageId", auth, async (req, res) => {

    try {

        const image = await ProductImages.findOne({
            where: {
                ProductId: req.params.id,
                id: req.params.imageId,
            }
        });
        console.log(image);
        res.contentType(image.type);

        fs.readFile(image.destination,
            function (err, content) {
                // Serving the image
                res.end(content);
            }
        );
    } catch (err) {
        res.status(200).send("");
    }
});


router.post("/:id/images/:imageId/delete", auth, async (req, res) => {
    try {

        //delete image here
        await ProductImages.destroy({
            where: {
                ProductId: req.params.id,
                id: req.params.imageId
            }
        });

        return res
            .status(200)
            .json({
                'success': true,
            });

        // console.log(image);
        // res.contentType(image.type);

        // fs.readFile(image.destination,
        //     function (err, content) {
        //         // Serving the image
        //         res.end(content);
        //     }
        // );
    } catch (err) {
        res.status(200).send("");
    }
});

module.exports = router;
