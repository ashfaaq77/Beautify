const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Orders, UserOrderBilling, OrderNotes, Users, OrderItem } = require("../models");
const { auth } = require("../middlewares/Auth");

const { validateOrder, validateOrderUpdate, validateOrderNotes, validateorderItems } = require("../validation/OrdersValidation");

const axios = require("axios");

const router = express.Router();



//Create a new order => return ID
//Update order


router.get("/ip1", auth, async (req, res) => {
    var IP = false;

    await axios.get("https://ifconfig.co/ip").then(response => {
        IP = response.data.replace("\n", "");
    })

    res.status(200)
        .json({
            'message': 'success',
            'IP': IP
        });
})

router.post('/:id/notes', auth, async (req, res) => {

    if (req.params.id <= 0) {
        return res
            .status(200)
            .json({
                'message': "No Params",
            });
    }

    const default_order = {
        notes: "",
        UserId: req.user,
        OrderId: req.params.id,
    }

    const values = { ...default_order, ...req.body }

    const { value, error } = validateOrderNotes(values);

    if (error != undefined) {
        error.details = error.details.map((e) => {
            return e.message;
        });

        return res
            .status(200)
            .json(error.details);
    }

    const notes = new OrderNotes(value);
    const saveNotes = await notes.save();

    if (!saveNotes) {
        return res
            .status(200)
            .json({
                'message': "Cannot save",
            });
    }

    return res
        .status(200)
        .json({
            'message': "succcess",
            'orderid': saveNotes.id
        });

});

router.post('/:id/update', auth, async (req, res) => {

    const dateCreated = new Date();

    const d = [
        dateCreated.getFullYear(),
        dateCreated.getMonth() + 1,
        dateCreated.getDate() < 10 ? '0' + dateCreated.getDate() : dateCreated.getDate()
    ];

    const default_order = {
        date_created: d.join('-'),
        hour: dateCreated.getHours(),
        min: dateCreated.getMinutes(),
        status: 'wc-on-hold',
        customer: req.user,
        billing: {},
        shipping: {}
    }


    if (req.params.id <= 0) {
        return res
            .status(200)
            .json({
                'message': "No Params",
            });
    }

    const values = { ...default_order, ...req.body }

    const { value, error } = validateOrderUpdate(values);

    if (error != undefined) {
        error.details = error.details.map((e) => {
            return e.message;
        });

        return res
            .status(200)
            .json(error.details);
    }

    //Need to update orders,
    //Need to update billing,
    //Need to Update Shipping

    const order = await Orders.findOne({
        where: { 'id': req.params.id, },
    })

    const time_created_at = [
        (value.hour < 10) ? "0" + value.hour : value.hour,
        (value.min) ? "0" + value.min : value.min,
        "00"
    ];

    order.created_at = value.date_created + ' ' + time_created_at.join(':');
    order.user = value.customer;
    order.status = value.status;

    const savedOrder = await order.save();

    if (!savedOrder) {
        return res
            .status(200)
            .json({
                'message': "cannot save",
            });
    }

    if (Object.keys(value.billing).length > 0) {
        await UserOrderBilling.destroy({
            where: {
                OrderId: order.id,
                shipping: 0
            }
        })
        value.billing.shipping = 0;
        value.billing.OrderId = order.id;
        const orderBilling = new UserOrderBilling(value.billing);
        const b = await orderBilling.save();
        if (!b) {
            console.log({
                'message': "Billing not save",
            });
        }
    }

    if (Object.keys(value.shipping).length > 0) {
        await UserOrderBilling.destroy({
            where: {
                OrderId: order.id,
                shipping: 1
            }
        })
        value.shipping.shipping = 1;
        value.shipping.OrderId = order.id;
        const orderShipping = new UserOrderBilling(value.shipping);
        const s = await orderShipping.save();
        if (!s) {
            console.log({
                'message': "Shipping not save",
            });
        }
    }

    return res
        .status(200)
        .json({
            'message': "succcess",
            'orderid': order.id
        });

});

router.post('/:id', auth, async (req, res) => {

    var savedOrder = false;

    const default_order = {
        status: '',
        user: req.user,
        created_at: new Date()
    }

    const values = { ...default_order, ...req.body }

    const { value, error } = validateOrder(values);

    if (error != undefined) {
        error.details = error.details.map((e) => {
            return e.message;
        });

        return res
            .status(200)
            .json(error.details);
    }

    if (req.params.id > 0) {

        const order = await Orders.findOne({
            where: { 'id': req.params.id, },
        })

        order.status = value.status;
        order.user = value.user;

        savedOrder = await order.save();

        if (!savedOrder) {
            return res
                .status(200)
                .json("cannot save");
        }

    } else {
        const order = new Orders(value);
        savedOrder = await order.save();

        if (!savedOrder) {
            return res
                .status(200)
                .json("cannot save");
        }
    }

    res.status(200)
        .json({
            'message': 'success',
            'order': savedOrder.id
        });
});

router.get('/:id/notes', auth, async (req, res) => {

    if (req.params.id < 1) {
        res.status(200)
            .json({
                'message': 'error',
                'order': 'No ID'
            });
    }

    const orderNotes = await OrderNotes.findAll({
        where: { 'OrderId': req.params.id },
    })

    res.status(200)
        .json({
            'message': 'success',
            'notes': orderNotes
        });
});

router.post('/:id/orderlist', auth, async (req, res) => {

    if (req.params.id < 1) {
        res.status(200)
            .json({
                'message': 'error',
                'order': 'No ID'
            });
    }

    OrderItem.destroy({
        where: {
            OrderId: req.params.id
        }
    });

    const { value, error } = validateorderItems(req.body);

    if (error) {
        console.log(error);
    }


    for (var i = 0; i < value.length; i++) {
        const data = {
            item_id: value[i].id,
            item_name: value[i].Item,
            item_qty: value[i].Qty,
            item_cost: value[i].Cost,
            item_attributes: value[i].attributes,
            OrderId: req.params.id
        }

        const orderItem = new OrderItem(data);
        savedOrderItem = await orderItem.save();
    }

    res.status(200)
        .json({
            'message': 'success',
            'orderItem': req.params.id
        });
});

router.get('/:id/orderlist', auth, async (req, res) => {

    const orderItems = await OrderItem.findAll({
        where: { 'OrderId': req.params.id },
    })

    res.status(200)
        .json({
            'message': 'success',
            'orderItems': orderItems
        });
});

router.get('/:id', auth, async (req, res) => {

    if (req.params.id < 1) {
        res.status(200)
            .json({
                'message': 'error',
                'order': 'No ID'
            });
    }

    const order = await Orders.findOne({
        where: { 'id': req.params.id },
        include: [UserOrderBilling]
    })

    res.status(200)
        .json({
            'message': 'success',
            'order': order
        });
});

router.get('/', auth, async (req, res) => {

    const orders = await Orders.findAll({
        include: [UserOrderBilling]
    })

    res.status(200)
        .json({
            'message': 'success',
            'order': orders
        });
});

module.exports = router;



