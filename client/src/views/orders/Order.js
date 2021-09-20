import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from "axios";
import AsyncSelect from 'react-select/async';
import { useHistory } from "react-router-dom";
// import AuthContext from "../../context/AuthContext";
import OrderStatus from "../../inc/OrderStatus";
import CommentBox from "../commentbox/CommentBox";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

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
    CListGroup,
    CListGroupItem,
    CInputCheckbox,
    CRow,
    CFormGroup,
    CTextarea,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CLabel,
} from '@coreui/react';

import {
    CIcon
} from '@coreui/icons-react';

const Order = ({ match }) => {

    const [title, setTitle] = useState(match.params.id);
    const [errormsg, setErrormsg] = useState("");
    const [successmsg, setSuccessmsg] = useState("");


    /** Variables */

    const [datecreated, setDatecreated] = useState("");
    const [hour, setHour] = useState("");
    const [min, setMin] = useState("");
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState([]);
    const [product, setProduct] = useState([]);

    const [billing, setBilling] = useState({
        "first_name": "Ashfaaq",
        "last_name": "Damree",
        "email": "ashfaaq77@gmail.com",
        "phone": "54923404",
        "company": "Shumatics",
        "address_line_1": "Royal Road",
        "address_line_2": "Upper Vale",
        "city": "The Vale",
        "post_code": "00230",
        "state": "MRU",
        "country": "Mauritius",
    });

    const [shipping, setShipping] = useState({
        "first_name": "Ashfaaq",
        "last_name": "Damree",
        "email": "ashfaaq77@gmail.com",
        "phone": "54923404",
        "company": "Shumatics",
        "address_line_1": "Royal Road",
        "address_line_2": "Upper Vale",
        "city": "The Vale",
        "post_code": "00230",
        "state": "MRU",
        "country": "Mauritius",
    });

    const [copyBilling, setCopyBilling] = useState({});
    const [copyShipping, setCopyShipping] = useState({});

    const [id, setId] = useState("new");
    const [ip, setIp] = useState("");

    /**End variable */

    /** Modal */

    const [modal, setModal] = useState(false)
    const [modalBilling, setModalBilling] = useState(false);
    const [modalShipping, setModalShipping] = useState(false);

    /** End Modal */

    const history = useHistory();

    const fields = ['Item', 'Cost', 'Qty', 'Vat', 'Total', '--'];

    const usersData = [
        {
            id: 0,
            Item: "Stretch Film Fullpack 50cm x 20mi",
            Sku: 1025626,
            attributes: {
                Size: 'M',
                Color: 'blue'
            },
            Cost: 23,
            Qty: 3,
            Vat: 10,
            Total: 10,
            '--': 'df'
        },
        {
            id: 0,
            Item: "",
            Sku: "",
            attributes: {},
            Cost: "",
            Qty: "",
            Vat: "Subtotal",
            Total: "",
            '--': '121'
        },
        {
            id: 0,
            Item: "",
            Sku: "",
            attributes: {},
            Cost: "",
            Qty: "",
            Vat: "Vat Total",
            Total: "",
            '--': '121'
        },
        {
            id: 0,
            Item: "",
            Sku: "",
            attributes: {},
            Cost: "",
            Qty: "",
            Vat: "Shipping",
            Total: "",
            '--': '121'
        },
        {
            id: 0,
            Item: "",
            Sku: "",
            attributes: {},
            Cost: "",
            Qty: "",
            Vat: "Total",
            Total: "",
            '--': '121'
        },
    ]


    //Hooks
    useEffect(() => {
        console.log("useEffect");
        getCustomers();
        getProducts();
        // getData();
    }, []);


    //Update
    const updateOrder = (e) => {
        e.preventDefault();
        console.log("Save Order");
    }

    // const getData = async () => {
    //     const res = await axios.get('https://geolocation-db.com/json/')
    //     console.log(res);
    //     // setIp(res.data.IPv4)
    // }

    const getCustomers = () => {
        const customersUrl = "http://localhost:5000/customers/";
        try {
            axios.get(customersUrl).then((res) => {
                if (res.data.length > 0) {
                    res.data.forEach((i, k) => {
                        const d = {
                            value: i.id,
                            label: i.first_name + " " + i.last_name + " ( " + i.email + " )"
                        };

                        customer.push(d)
                        setCustomer(customer);
                    })
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    const getProducts = () => {
        const productsUrl = "http://localhost:5000/products/";
        try {
            axios.get(productsUrl).then((res) => {
                console.log(res.data);
                if (res.data.length > 0) {
                    res.data.forEach((i, k) => {
                        const d = {
                            value: i.id,
                            label: i.title + " ( " + i.sku + " )"
                        };

                        product.push(d)
                        setProduct(customer);
                    })
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    const filterColors = (inputValue) => {
        if (inputValue) {
            return customer.filter(i =>
                i.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        }
        return '';
    };

    const filterProducts = (inputValue) => {
        if (inputValue) {
            return product.filter(i =>
                i.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        }
        return '';
    };

    //Async Select
    const loadOptions = (inputValue, callback) => {

        setTimeout(() => {
            callback(filterColors(inputValue));
        }, 1000);
    };

    const productOptions = (inputValue, callback) => {
        setTimeout(() => {
            console.log(product);
            callback(filterProducts(inputValue));
        }, 1000);
    }

    const saveOrder = () => {
        console.log("save order");
        console.log([
            datecreated,
            hour,
            min,
            status,
            customer,
        ]);
    }

    const dateChange = (e) => {
        setDatecreated(e.target.value);
    }

    const hourChange = (e) => {
        setHour(e.target.value);
    }

    const minChange = (e) => {
        setMin(e.target.value);
    }

    const statusChange = (e) => {
        setStatus(e.target.value);
    }

    const editBilling = () => {
        console.log("click");
    }

    const editShipping = () => {
        console.log("click");
    }

    const getValue = (k) => {
        if (modalBilling) {
            return billing[k];
        } else if (modalShipping) {
            return shipping[k];
        }
    }

    const detailsChange = (e) => {
        const name = e.target.attributes.name.value;

        if (modalBilling) {
            billing[name] = e.target.value;
            setBilling(billing);
        } else if (modalShipping) {
            shipping[name] = e.target.value;
            setShipping(shipping);
        }
    }

    return (
        <CForm>
            <CRow>
                <CCol lg={9}>
                    <CCard>
                        <CCardBody>
                            <div className="order-details">
                                <h2><strong>Order #{id} details</strong></h2>
                                <p>Customer IP: {ip}</p>
                            </div>
                            <CRow>
                                <CCol lg={4}>
                                    <div className="general">
                                        <CRow>
                                            <CCol lg={12}>
                                                <p><strong>General</strong></p>
                                            </CCol>
                                            <CCol lg={12}>
                                                <CLabel htmlFor="date-input">Date created:</CLabel>
                                            </CCol>
                                            <CCol lg={12}>
                                                <CInput type="date" id="date-input" name="date" placeholder="date" value={datecreated} onChange={dateChange} />
                                                <br />
                                            </CCol>
                                            <CCol lg={2}>
                                                @
                                            </CCol>
                                            <CCol lg={5}>
                                                <CInput type="number" id="hour" name="date-hour" placeholder="hour" value={hour} onChange={hourChange} />
                                            </CCol>
                                            <CCol lg={5}>
                                                <CInput type="number" id="min" name="date-min" placeholder="min" value={min} onChange={minChange} />
                                            </CCol>

                                            <CCol lg={12}>
                                                <br />
                                                <CLabel htmlFor="order-status">Status:</CLabel>
                                            </CCol>
                                            <CCol lg={12}>
                                                <CSelect custom name="order-status" id="order-status" value={status} onChange={statusChange}>
                                                    {
                                                        Object.keys(OrderStatus).map((i, k) => {
                                                            return (
                                                                <option value={i}>{OrderStatus[i]}</option>
                                                            )
                                                        })
                                                    }
                                                </CSelect>
                                            </CCol>
                                            <CCol lg={12}>
                                                <br />
                                                <CLabel htmlFor="order-customer">Customer:</CLabel>
                                            </CCol>
                                            <CCol lg={12}>
                                                <AsyncSelect
                                                    cacheOptions
                                                    loadOptions={loadOptions}
                                                    defaultOptions
                                                    onInputChange={(e) => console.log(e)}
                                                />
                                            </CCol>
                                        </CRow>
                                    </div>
                                </CCol>
                                <CCol lg={4}>
                                    <CRow>
                                        <CCol lg={12}>
                                            <p><strong>Billing</strong> <FontAwesomeIcon onClick={() => { setModalBilling(true); setCopyBilling({ ...copyBilling, ...billing }); }} icon={faEdit} /></p>
                                        </CCol>
                                        <CCol lg={12}>
                                            <p>
                                                {Object.keys(billing).map((a) => {
                                                    return (
                                                        <div>
                                                            {billing[a]}
                                                            <br />
                                                        </div>
                                                    )
                                                })}
                                                <br />
                                                #049484
                                            </p>
                                        </CCol>
                                    </CRow>
                                </CCol>
                                <CCol lg={4}>
                                    <CRow>
                                        <CCol lg={12}>
                                            <p><strong>Shipping</strong> <FontAwesomeIcon onClick={() => {
                                                setModalShipping(true); setCopyShipping({ ...copyShipping, ...shipping });
                                            }} icon={faEdit} /></p>
                                        </CCol>
                                        <CCol lg={12}>
                                            <p>
                                                {Object.keys(shipping).map((a) => {
                                                    return (
                                                        <div>
                                                            {shipping[a]}
                                                            <br />
                                                        </div>
                                                    )
                                                })}
                                                <br />
                                                #049484
                                            </p>
                                        </CCol>
                                    </CRow>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>

                    <CCard>
                        <CCardHeader>
                            <CRow>
                                <CCol lg={10}>
                                    Orders
                                </CCol>
                                <CCol lg={2}>
                                    <CButton block color="primary" onClick={() => setModal(!modal)}>Add Product</CButton>
                                </CCol>
                            </CRow>
                        </CCardHeader>

                        <CCardBody>
                            <CDataTable
                                items={usersData}
                                fields={fields}
                                itemsPerPage={5}
                                pagination
                                scopedSlots={
                                    {
                                        'Item':
                                            (e) => {
                                                if (e.Item != "") {
                                                    return (
                                                        <td>
                                                            <strong>{e.Item}</strong><br />
                                                            {
                                                                Object.keys(e.attributes).length > 0 &&
                                                                Object.keys(e.attributes).map((i, k) => {
                                                                    return (
                                                                        <div>
                                                                            <strong> {i}:</strong> {e.attributes[i]}
                                                                            <br />
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                    )
                                                } else {
                                                    return (<td></td>);
                                                }
                                            },
                                        'Vat':
                                            (e) => {
                                                if (typeof e.Vat == 'string') {
                                                    return (<td><strong>{e.Vat}:</strong></td>);
                                                } else {
                                                    return (<td>{e.Vat}</td>);
                                                }
                                            }
                                    }}
                            />
                        </CCardBody>
                    </CCard>

                </CCol>
                <CCol lg={3}>
                    <CCard>
                        <CCardBody>
                            <CButton block color="primary" onClick={saveOrder}>UPDATE</CButton>
                        </CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>
                            <CommentBox></CommentBox>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow >
            <CModal
                show={modal}
                onClose={setModal}
            >
                <CModalHeader closeButton>
                    <CModalTitle>Add Product</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup>
                                <CInputGroup>
                                    <CLabel>Product</CLabel>
                                </CInputGroup>
                                <CInputGroup>
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={productOptions}
                                        onInputChange={(e) => console.log(e)}
                                    />
                                </CInputGroup>
                            </CFormGroup>
                            <CFormGroup>
                                <CInputGroup>
                                    <CLabel>Cost per Unit</CLabel>
                                </CInputGroup>
                                <CInputGroup>
                                    <CInput type="number" name="cost" defaultValue={0} placeholder="Cost" onChange={() => { }}></CInput>
                                </CInputGroup>
                            </CFormGroup>
                            <CFormGroup>
                                <CInputGroup>
                                    <CLabel>Quantity(Qty)</CLabel>
                                </CInputGroup>
                                <CInputGroup>
                                    <CInput type="number" name="cost" defaultValue={0} placeholder="Quantity" onChange={() => { }}></CInput>
                                </CInputGroup>
                            </CFormGroup>
                            <CFormGroup>
                                <CInputGroup>
                                    <CLabel>VAT</CLabel>
                                </CInputGroup>
                                <CInputGroup>
                                    <CInput type="number" name="cost" defaultValue={0} placeholder="Vat" onChange={() => { }}></CInput>
                                </CInputGroup>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => { }}>SAVE</CButton>{' '}
                    <CButton
                        color="secondary"
                        onClick={() => setModal(false)}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
            <CModal
                show={modalBilling || modalShipping}
                onClose={() => { setModalBilling(false); setModalShipping(false); }}
            >
                <CModalHeader closeButton>

                    <CModalTitle>
                        {modalBilling && "Billing"}
                        {modalShipping && "Shipping"}
                        <CButton color="primary">Load Profile Billing</CButton>
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow>
                            <CCol xs="12">
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>First Name</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="first_name" defaultValue={getValue('first_name')} placeholder="First Name" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Last Name</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="last_name" defaultValue={getValue('last_name')} placeholder="Last Name" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Email</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="email" defaultValue={getValue('email')} placeholder="Email" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Phone</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="phone" defaultValue={getValue('phone')} placeholder="Phone" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Company</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="company" defaultValue={getValue('company')} placeholder="Company" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Address Line 1</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="address_line_1" defaultValue={getValue('address_line_1')} placeholder="Address Line 1" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Address Line 2</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="address_line_2" defaultValue={getValue('address_line_2')} placeholder="Address Line 2" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>City</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="city" defaultValue={getValue('city')} placeholder="City" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Post Code</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="post_code" defaultValue={getValue('post_code')} placeholder="Post Code" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>State</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="state" defaultValue={getValue('state')} placeholder="State" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Country</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="country" defaultValue={getValue('country')} placeholder="Country" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => { setModalBilling(false); setModalShipping(false); }}>Save</CButton>{' '}
                    <CButton
                        color="secondary"
                        onClick={() => {
                            { modalBilling && setBilling({ ...billing, ...copyBilling }) }
                            { modalShipping && setShipping({ ...shipping, ...copyShipping }) }
                            setModalBilling(false);
                            setModalShipping(false);

                        }}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>

        </CForm>
    )
}

export default Order;