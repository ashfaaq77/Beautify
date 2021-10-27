const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Products, ProductAttributes, ProductCategories, ProductImages } = require("../models");
const { auth } = require("../middlewares/Auth");

const { validateProduct } = require("../validation/ProductsValidation");

const upload = require("../config/multer");

const router = express.Router();


router.post('/:id/uploadImageFeatured', auth, upload.single('image'), async (req, res) => {

    await ProductImages.destroy({
        where: {
            ProductId: req.params.id,
            featured: 1
        }
    });

    //delete images

    const image = new ProductImages({
        originalname: req.file.originalname,
        name: req.file.filename,
        type: req.file.mimetype,
        destination: req.file.path,
        size: req.file.size,
        featured: 1,
        ProductId: req.params.id
    });

    const savedImage = await image.save();

    return res
        .status(200)
        .json({
            'success': true,
            'imageId': savedImage.id
        });
    // res.send(req.file)

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.post('/:id/uploadImageGallery', auth, upload.single('image'), async (req, res) => {

    // await ProductImages.destroy({
    //     where: {
    //         ProductId: req.params.id,
    //         featured: 0
    //     }
    // });

    //delete images
    const image = new ProductImages({
        originalname: req.file.originalname,
        name: req.file.filename,
        type: req.file.mimetype,
        destination: req.file.path,
        size: req.file.size,
        featured: 0,
        ProductId: req.params.id
    });

    const savedImage = await image.save();

    return res
        .status(200)
        .json({
            'success': true,
            'imageId': savedImage.id
        });
    // res.send(req.file)

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.get('/:id/getGallery', auth, async (req, res) => {

    //delete images
    const images = await ProductImages.findAll({
        where: {
            ProductId: req.params.id,
            featured: 0
        },
        attributes: ['id'],
    });

    return res
        .status(200)
        .json({
            'success': true,
            'images': images
        });
    // res.send(req.file)

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.post('/:id/uploadImages', auth, upload.array('images', 10), async (req, res) => {
    console.log(req);

    res.send(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.post('/:id', auth, async (req, res) => {

    const default_product = {
        title: '',
        description: '',
        sku: '',
        regular_price: 0,
        sale_price: 0,
        stock: 0,
        quantity: 0,
        pre_orders: 0,
        taxable: 0,
        attributes: {},
        categories: [],
    }

    if (!Array.isArray(req.body['categories'])) {
        delete req.body['categories'];
    }

    if (!(typeof req.body['attributes'] === "object")) {
        delete req.body['attributes'];
    }

    const values = { ...default_product, ...req.body }

    const attributes = values['attributes'];
    const categories = values['categories'];

    delete values['attributes'];
    delete values['categories'];

    const { value, error } = validateProduct(values);

    if (error != null) {
        error.details = error.details.map((e) => {
            return e.message;
        });

        return res
            .status(200)
            .json(error.details);
    }

    if (req.params.id > 0) {

        const product = await Products.findOne({
            where: { 'id': req.params.id, },
        })

        product.title = value.title;
        product.description = value.description;
        product.sku = value.sku;
        product.regular_price = value.regular_price;
        product.sale_price = value.sale_price;
        product.stock = value.stock;
        product.quantity = value.quantity;
        product.pre_orders = value.pre_orders;
        product.taxable = value.taxable;

        savedProduct = await product.save();

    } else {
        const product = new Products(value);
        savedProduct = await product.save();

        if (!savedProduct) {
            return res
                .status(200)
                .json("cannot save");
        }
    }

    if (savedProduct) {
        //saved attributes
        if (Object.keys(attributes).length > 0) {

            await ProductAttributes.destroy({
                where: { ProductId: savedProduct.id }
            });

            Object.keys(attributes).forEach((i, k) => {
                attributes[i].forEach((j, l) => {
                    const attr = new ProductAttributes({
                        values: j,
                        ProductId: savedProduct.id,
                        AttributeId: i
                    });

                    attr.save();
                })
            });

        }

        //saved categories
        if (categories.length > 0) {
            await ProductCategories.destroy({
                where: { ProductId: savedProduct.id }
            });

            categories.forEach((i, k) => {
                const cat = new ProductCategories({
                    ProductId: savedProduct.id,
                    CategoryId: i
                });

                cat.save();
            })
        }
    }

    res.status(200)
        .json({
            'message': 'success',
            'product': savedProduct.id
        });
});



router.get('/', auth, async (req, res) => {
    try {
        const products = await Products.findAll({
            // attributes: ['id', 'title', 'sku', 'regular_price', 'sale_price'],
            include: [ProductAttributes, ProductCategories],
        })
        res.json(products);
    } catch (err) {
        res.status(500).send();
    }
});


router.get('/:id', auth, async (req, res) => {
    try {

        const id = req.params.id;

        const products = await Products.findOne({
            where: { 'id': id, },
            include: [ProductAttributes, ProductCategories],
        })
        res.json(products);
    } catch (err) {
        res.status(500).send();
    }
});

// router.get('/attributes', auth, async (req, res) => {
//     try {
//         const attributes = await ProductAttributes.findAll({
//             attributes: ['id', 'name', 'values'],
//         })
//         res.json(attributes);
//     } catch (err) {
//         res.status(500).send();
//     }
// });

module.exports = router;



