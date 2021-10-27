import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import AsyncSelect from 'react-select/async';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import serverRoutes from "../../points";
import createServerUrl from "../../inc/functions";

//component - CoreUI / CommentBox
import {
    CButton,
    CCard,
    CCardBody,
    CSelect,
    CCol,
    CForm,
    CInput,
    CCardHeader,
    CDataTable,
    CInputGroup,
    CRow,
    CFormGroup,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CLabel,
} from '@coreui/react';

import CIcon from '@coreui/icons-react';


const OrderList = props => {

    //Data
    const fields = ['Item', 'Cost', 'Qty', 'Vat', 'Total', 'Action'];

    const orderData = [];

    const subtotal = {
        id: 0,
        Item: "",
        Sku: "",
        attributes: {},
        Cost: "",
        Qty: "",
        Vat: "Subtotal",
        Total: 0,
        Action: ''
    };

    const vat_total = {
        id: 0,
        Item: "",
        Sku: "",
        attributes: {},
        Cost: "",
        Qty: "",
        Vat: "Vat Total",
        Total: 0,
        Action: ''
    };

    const shipping_total = {
        id: 0,
        Item: "",
        Sku: "",
        attributes: {},
        Cost: "",
        Qty: "",
        Vat: "Shipping",
        Total: 10,
        Action: ''
    };

    const total = {
        id: 0,
        Item: "",
        Sku: "",
        attributes: {},
        Cost: "",
        Qty: "",
        Vat: "Total",
        Total: 0,
        Action: ''
    }

    //STATE
    const [modal, setModal] = useState(false)

    const [orderListData, setOrderListData] = useState(orderData);
    const [orderAllList, setOrderAllList] = useState([...orderData, subtotal, vat_total, shipping_total, total]);

    const [product, setProduct] = useState([]);
    const [productDetail, setProductDetail] = useState([]);

    const [attributes, setAttributes] = useState([]);

    /**Add product Popup*/
    const addProductInit = {
        "product": 0,
        "cost_per_unit": 0,
        "quantity": 0,
        'attributes': []
    }

    const [addProduct, setAddProduct] = useState({
        "product": "",
        "cost_per_unit": 0,
        "quantity": 0,
        'attributes': []
    });

    const [addProductAttributes, setAddProductAttributes] = useState({});

    const [cProduct, setCProduct] = useState(0);
    const [cCostPerUnit, setCCostPerUnit] = useState(0);
    const [cQuantity, setCQuantity] = useState(0);

    const [attributesSelected, setAttributesSelected] = useState({});

    const [orderItem, setOrderItem] = useState([]);

    const [status, setStatus] = useState(0);
    //Hooks
    useEffect(() => {
        console.log("useEffect1");
        getProducts()
        getAttributes();
    }, []);

    //use Effect
    const getProducts = () => {
        const productsUrl = createServerUrl(serverRoutes.products);

        try {
            axios.get(productsUrl).then((res) => {
                if (res.data.length > 0) {
                    setProductDetail(res.data);
                    res.data.forEach((i, k) => {
                        const d = {
                            value: i.id,
                            label: i.title + " ( " + i.sku + " )"
                        };

                        product.push(d)
                        setProduct(product);
                    })
                    getOrderItems(res.data);

                }
            })
        } catch (err) {
            console.error(err);
        }
    }

    const getOrderItems = (pD) => {
        const orderItemsUrl = createServerUrl(serverRoutes.orders, props.orderid + "/orderlist");

        try {
            axios.get(orderItemsUrl).then((res) => {
                if (res.data.orderItems.length > 0) {
                    var orderAllListCopy = orderAllList;
                    var orderListDataCopy = orderListData;
                    console.log(orderAllListCopy);
                    for (var i = 0; i < res.data.orderItems.length; i++) {
                        const aP = addProductInit;

                        aP.product = res.data.orderItems[i].item_id;
                        aP.cost_per_unit = res.data.orderItems[i].item_cost;
                        aP.quantity = res.data.orderItems[i].item_qty;
                        Object.keys(res.data.orderItems[i].item_attributes).forEach((j) => {
                            aP.attributes.push({
                                "id": res.data.orderItems[i].item_attributes[j].AttributeId,
                                "value": res.data.orderItems[i].item_attributes[j].id
                            });
                        });
                        console.log(aP);

                        /**If modify, need to modify function addProductToCart */
                        const p = pD.find(i => {
                            return i.id == aP.product
                        });

                        if (p == undefined) {
                            return;
                        }

                        const attrs = {};

                        if (aP.attributes.length > 0) {
                            aP.attributes.forEach((t) => {
                                const f = p.ProductAttributes.find((y) => {
                                    return y.id == t.value;
                                })
                                if (f) {
                                    attrs[f.id] = f;
                                }
                            })
                        }

                        var vat = 0;
                        const total = aP.cost_per_unit * aP.quantity;
                        if (p.taxable) {
                            vat = total * 15 / 100;
                        }

                        var orderP = orderAllListCopy.find((e) => {
                            return e.id == aP.product;
                        });

                        var elem = {
                            id: p.id,
                            Item: p.title,
                            Sku: p.sku,
                            attributes: attrs,
                            Cost: aP.cost_per_unit,
                            Qty: aP.quantity,
                            Vat: vat,
                            Total: total,
                            Action: 'faEdit'
                        };

                        var list = [elem, ...orderListDataCopy];

                        console.log([
                            'list1',
                            orderListData,
                            list
                        ]);
                        const s = orderAllListCopy.find((t) => {
                            return t.Vat == 'Subtotal'
                        });

                        const v = orderAllListCopy.find((t) => {
                            return t.Vat == 'Vat Total'
                        });

                        const sh = orderAllListCopy.find((t) => {
                            return t.Vat == 'Shipping'
                        });

                        const t = orderAllListCopy.find((t) => {
                            return t.Vat == 'Total'
                        });

                        var T = list.reduce((a, b) => a.Total + b.Total);
                        var TV = list.reduce((a, b) => a.Vat + b.Vat);

                        if (list.length == 1) {
                            T = T.Total;
                            TV = TV.Vat;
                        }

                        var ST = T - TV;
                        var SH = 10;


                        s['Total'] = ST;
                        v['Total'] = TV;
                        sh['Total'] = SH;
                        t['Total'] = T;

                        var allOrder = [...list, s, v, sh, t];

                        orderAllListCopy = allOrder;
                        orderListDataCopy = list;

                    }
                    setOrderListData(list)
                    setOrderAllList(orderAllListCopy);
                    resetProductChange(addProductInit);
                    setAddProductAttributes({});

                    /**End */
                }

            });
        } catch (err) {
            console.error(err);
        }
    }

    const getAttributes = () => {
        const attributeUrl = createServerUrl(serverRoutes.attributes);

        try {
            axios.get(attributeUrl).then((res) => {
                if (res.data.length > 0) {
                    setAttributes(res.data);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    //Filter
    const filterProducts = (inputValue) => {
        if (inputValue) {
            return product.filter(i => {
                return i.label.toLowerCase().includes(inputValue.toLowerCase())
            });
        }
        return '';
    };

    const productOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterProducts(inputValue));
        }, 1000);
    }

    const resetProductChange = (obj) => {
        Object.keys(obj).forEach((i) => {
            if (i == 'product') {
                const p = productDetail.find(z => {
                    return z.id == obj[i]
                });

                if (p == undefined) {
                    setCProduct(0);
                } else {
                    setCProduct({ label: p.title, value: obj[i] });
                }
            } else if (i == 'cost_per_unit') {
                setCCostPerUnit(obj[i]);
            } else if (i == 'quantity') {
                setCQuantity(obj[i]);
            }
        })
    }

    const setProductChange = (e, type) => {

        if (type == 'product') {
            var initP = addProductInit;
        } else {
            var initP = addProduct;
        }

        const addProductCopy = initP;

        addProductCopy[type] = e;

        const p = productDetail.find(i => {
            return i.id == addProductCopy.product
        });

        if (type == 'product') {

            if (p.sale_price > 0) {
                addProductCopy.cost_per_unit = p.sale_price;
            } else {
                addProductCopy.cost_per_unit = p.regular_price;
            }
        }

        //This is repeated below for attribute change
        const pA = p.ProductAttributes;
        const attributesList = {};

        const attrS = addProduct.attributes;

        pA.forEach((elem) => {
            if (!Array.isArray(attributesList[elem.AttributeId])) {
                attributesList[elem.AttributeId] = [];
            }

            const findS = attrS.find(z => parseInt(z.id) == elem.AttributeId);

            const a = {
                "id": elem.id,
                "label": elem.values
            }

            if (findS != undefined && parseInt(findS.value) == elem.id) {
                a.selected = true
                attributesSelected[elem.AttributeId] = elem.id;
            } else {
                a.selected = false;
                attributesSelected[elem.AttributeId] = "";
            }

            attributesList[elem.AttributeId] = [...attributesList[elem.AttributeId], a];
        })


        setAttributesSelected(attributesSelected);
        setAddProductAttributes(attributesList);


        resetProductChange(addProductCopy);
        setAddProduct(addProductCopy);

    }



    const setProductAttributes = (e, id) => {

        const selected = {
            id: id,
            value: e
        };

        const v = addProduct.attributes.find(i => i.id == id);

        if (v == undefined) {
            addProduct.attributes.push(selected);
        } else {
            v.value = e;
        }

        setAddProduct(addProduct);


        //START
        const p = productDetail.find(i => {
            return i.id == addProduct.product
        });

        const pA = p.ProductAttributes;
        const attributesList = {};

        const attrS = addProduct.attributes;

        pA.forEach((elem) => {
            if (!Array.isArray(attributesList[elem.AttributeId])) {
                attributesList[elem.AttributeId] = [];
            }

            const findS = attrS.find(z => parseInt(z.id) == elem.AttributeId);

            const a = {
                "id": elem.id,
                "label": elem.values
            }

            if (findS != undefined && parseInt(findS.value) == elem.id) {
                a.selected = true
                attributesSelected[elem.AttributeId] = elem.id;
            } else {
                a.selected = false;
                attributesSelected[elem.AttributeId] = "";
            }

            attributesList[elem.AttributeId] = [...attributesList[elem.AttributeId], a];
        })

        setAttributesSelected(attributesSelected);

        setAddProductAttributes(attributesList);
        //END
    }

    const getAddProductValue = (type) => {
        return addProduct[type] || "";
    }

    const add_product_cart = (e) => {
        addProductToCart(addProduct, productDetail);
    }

    const addProductToCart = (aP, pD) => {
        if (aP.product != "") {

            const p = pD.find(i => {
                return i.id == aP.product
            });

            console.log([
                'List P',
                p,
                pD
            ]);

            if (p == undefined) {
                return;
            }

            const attrs = {};

            if (aP.attributes.length > 0) {
                aP.attributes.forEach((t) => {
                    const f = p.ProductAttributes.find((y) => {
                        return y.id == t.value;
                    })
                    if (f) {
                        attrs[f.id] = f;
                    }
                })
            }

            var vat = 0;
            const total = aP.cost_per_unit * aP.quantity;
            if (p.taxable) {
                vat = total * 15 / 100;
            }

            var orderP = orderAllList.find((e) => {
                return e.id == aP.product;
            });

            var elem = {
                id: p.id,
                Item: p.title,
                Sku: p.sku,
                attributes: attrs,
                Cost: aP.cost_per_unit,
                Qty: aP.quantity,
                Vat: vat,
                Total: total,
                Action: 'faEdit'
            };

            var list = orderAllList;

            if (orderP) {

                const newOrderAllList = orderListData.map((e) => {
                    if (e.id == elem.id) {
                        return elem;
                    }

                    return e;
                })

                list = newOrderAllList;

            } else {
                list = [elem, ...orderListData];
            }


            const s = orderAllList.find((t) => {
                return t.Vat == 'Subtotal'
            });

            const v = orderAllList.find((t) => {
                return t.Vat == 'Vat Total'
            });

            const sh = orderAllList.find((t) => {
                return t.Vat == 'Shipping'
            });

            const t = orderAllList.find((t) => {
                return t.Vat == 'Total'
            });

            var T = list.reduce((a, b) => a.Total + b.Total);
            var TV = list.reduce((a, b) => a.Vat + b.Vat);

            if (list.length == 1) {
                T = T.Total;
                TV = TV.Vat;
            }

            var ST = T - TV;
            var SH = 10;


            s['Total'] = ST;
            v['Total'] = TV;
            sh['Total'] = SH;
            t['Total'] = T;

            const allOrder = [...list, s, v, sh, t];

            setOrderListData(list)
            setOrderAllList(allOrder);
            resetProductChange(addProductInit);
            setAddProductAttributes({});
            setModal(false)

        }
    }

    const saveOrders = () => {
        console.log('orders')

        const updateOrderListUrl = createServerUrl(serverRoutes.orders, props.orderid + '/orderlist');

        console.log(
            orderListData
        );

        axios.post(updateOrderListUrl, orderListData).then((res) => {
            if (res.data.message == undefined) {
                console.log(res.data);
            } else if (res.data.message == 'succcess') {
                alert(res.data.orderid);
                console.log(res);
            } else if (res.data.message != undefined) {
                alert(res.data.message);
            }
        });

    }

    const editRow = (id) => {
        if (id > 0) {
            console.log(orderAllList);

            const orderP = orderAllList.find((e) => {
                return e.id == id;
            });

            addProduct.product = id;
            addProduct.quantity = orderP.Qty;
            addProduct.cost_per_unit = orderP.Cost;
            addProduct.attributes = [];

            Object.keys(orderP.attributes).forEach(e => {
                addProduct.attributes.push({
                    id: orderP.attributes[e].AttributeId,
                    value: orderP.attributes[e].id
                });
            })

            setAddProduct(addProduct);
            resetProductChange(addProduct);

            //START
            const p = productDetail.find(i => {
                return i.id == addProduct.product
            });

            const pA = p.ProductAttributes;
            const attributesList = {};

            const attrS = addProduct.attributes;

            pA.forEach((elem) => {
                if (!Array.isArray(attributesList[elem.AttributeId])) {
                    attributesList[elem.AttributeId] = [];
                }

                const findS = attrS.find(z => parseInt(z.id) == elem.AttributeId);

                const a = {
                    "id": elem.id,
                    "label": elem.values
                }

                if (findS != undefined && parseInt(findS.value) == elem.id) {
                    a.selected = true
                    attributesSelected[elem.AttributeId] = elem.id;
                } else {
                    a.selected = false;
                    attributesSelected[elem.AttributeId] = "";
                }

                attributesList[elem.AttributeId] = [...attributesList[elem.AttributeId], a];
            })

            setAttributesSelected(attributesSelected);

            setAddProductAttributes(attributesList);
            //END

            setModal(!modal);

        }
    }

    return (
        <div>
            <CCard>
                <CCardHeader>
                    <CRow>
                        <CCol lg={8}>
                            Orders
                        </CCol>
                        <CCol lg={2}>
                            <CButton block color="primary" onClick={() => { resetProductChange(addProductInit); setAddProductAttributes({}); saveOrders(); }}>Save Orders</CButton>
                        </CCol>
                        <CCol lg={2}>
                            <CButton block color="primary" onClick={() => { setModal(!modal); resetProductChange(addProductInit); setAddProductAttributes({}); }}>Add Product</CButton>
                        </CCol>
                    </CRow>
                </CCardHeader>

                <CCardBody>
                    <CDataTable
                        items={orderAllList}
                        fields={fields}
                        itemsPerPage={orderAllList.length}
                        pagination
                        scopedSlots={
                            {
                                'Item':
                                    (e) => {
                                        if (typeof e == 'object' && e.Item != "") {
                                            return (
                                                <td key={Math.random()}>
                                                    <strong>{e.Item}</strong><br />
                                                    {
                                                        Object.keys(e.attributes).length > 0 &&
                                                        Object.keys(e.attributes).map((i, k) => {
                                                            const atr = attributes.find((f) => {
                                                                return f.id == e.attributes[i].AttributeId;
                                                            });
                                                            return (
                                                                <div>
                                                                    <strong> {atr.name}:</strong> {e.attributes[i].values}
                                                                    <br />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </td>
                                            )
                                        } else {
                                            return (<td key={Math.random()}></td>);
                                        }
                                    },
                                'Vat':
                                    (e) => {
                                        if (typeof e.Vat == 'string') {
                                            return (<td key={Math.random()}><strong>{e.Vat}:</strong></td>);
                                        } else {
                                            return (<td key={Math.random()}>{e.Vat}</td>);
                                        }
                                    },
                                'Action':
                                    (e) => {
                                        if (e['Action'] == 'faEdit') {
                                            return (
                                                <td key={Math.random()} onClick={(i) => editRow(e.id)}> <FontAwesomeIcon icon={faEdit} /></td>
                                            )
                                        }

                                        return (
                                            <td key={Math.random()}></td>
                                        )
                                    }
                            }}
                    />
                </CCardBody>
            </CCard>
            <CModal
                show={modal}
                onClose={setModal}
            >
                <CModalHeader closeButton>
                    <CModalTitle>Add Product</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CForm>
                            <CCol xs="12">
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Product</CLabel>
                                    </CInputGroup>
                                    <CInputGroup className="productOptions">
                                        <AsyncSelect
                                            cacheOptions
                                            // defaultOptions
                                            loadOptions={productOptions}
                                            onChange={(e) => setProductChange(e.value, 'product')}
                                            value={cProduct}
                                        />
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Cost per Unit</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="number" name="cost" value={cCostPerUnit} placeholder="Cost" onChange={(e) => setProductChange(e.target.value, 'cost_per_unit')} />
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Quantity(Qty)</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="number" name="quantity" value={cQuantity} placeholder="Quantity" onChange={(e) => setProductChange(e.target.value, 'quantity')} />
                                    </CInputGroup>
                                </CFormGroup>
                                {Object.keys(addProductAttributes).map((elem) => {
                                    const attr = attributes.find((e) => {
                                        return e.id == elem;
                                    });

                                    var valueSelected = addProductAttributes[elem].find(z => {
                                        return z.selected;
                                    })

                                    if (valueSelected) {
                                        valueSelected = valueSelected.id;
                                    } else {
                                        valueSelected = "";
                                    }

                                    return (
                                        <CFormGroup>
                                            <CInputGroup>
                                                <CLabel>{attr.name}</CLabel>
                                            </CInputGroup>
                                            <CInputGroup>
                                                <CSelect name={Math.random()} custom className="attribute-selected attributes-field" value={valueSelected} onChange={(e) => setProductAttributes(e.target.value, elem)}>
                                                    <option key={Math.random()} value="">Select a {attr.name}</option>
                                                    {addProductAttributes[elem].map(elem1 => {
                                                        return (
                                                            <option key={Math.random()} value={elem1.id}>{elem1.label}</option>
                                                        )
                                                    })}
                                                </CSelect>
                                            </CInputGroup>
                                        </CFormGroup>
                                    )
                                })}
                            </CCol>
                        </CForm>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={add_product_cart}>SAVE</CButton>{' '}
                    <CButton
                        color="secondary"
                        onClick={() => setModal(false)}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )

}

OrderList.propTypes = {
    orderid: PropTypes.number
};

OrderList.defaultProps = {
    orderid: 0
}

export default OrderList

