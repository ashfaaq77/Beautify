import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from "axios";
import AsyncSelect from 'react-select/async';
import { useHistory } from "react-router-dom";
// import AuthContext from "../../context/AuthContext";
import OrderStatus from "../../inc/OrderStatus";
import CommentBox from "../commentbox/CommentBox";
import OrderList from './OrderList';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import serverRoutes from "../../points";
import createServerUrl from "../../inc/functions";

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
    const [customerSelected, setCustomerSelected] = useState(0);


    /* Customer / Products / Attributes */
    const [customer, setCustomer] = useState([]);
    const [customerDetail, setCustomerDetail] = useState([]);

    // const [billing, setBilling] = useState({
    //     "first_name": "Ashfaaq",
    //     "last_name": "Damree",
    //     "email": "ashfaaq77@gmail.com",
    //     "phone": "54923404",
    //     "company": "Shumatics",
    //     "address_line_1": "Royal Road",
    //     "address_line_2": "Upper Vale",
    //     "city": "The Vale",
    //     "post_code": "00230",
    //     "state": "MRU",
    //     "country": "Mauritius",
    // });

    const [billing, setBilling] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "phone": "",
        "company": "",
        "address_line_1": "",
        "address_line_2": "",
        "city": "",
        "post_code": "",
        "state": "",
        "country": "",
    });

    const [shipping, setShipping] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "phone": "",
        "company": "",
        "address_line_1": "",
        "address_line_2": "",
        "city": "",
        "post_code": "",
        "state": "",
        "country": "",
    });

    const [copyBilling, setCopyBilling] = useState({});
    const [copyShipping, setCopyShipping] = useState({});

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [postCode, setPostCode] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");


    const [id, setId] = useState("new");
    const [ip, setIp] = useState("");

    /**End variable */

    /** Modal */

    const [modalBilling, setModalBilling] = useState(false);
    const [modalShipping, setModalShipping] = useState(false);

    /** End Modal */

    const history = useHistory();

    //Hooks
    useEffect(async () => {
        console.log("useEffect");

        if (Object.keys(match.params) < 1) {
            //Create orders and redirect to it;

            const url = createServerUrl(serverRoutes.orders, "new");

            const data = {
                status: "wc-on-hold"
            }

            axios.post(url, data).then((res) => {
                if (res.data.message != undefined && res.data.message == 'success') {
                    history.push("/admin/orders/" + res.data.order);
                }
            });

        } else {

            await getCustomers();
            getUserIP();

            setId(match.params.id);

            const url = createServerUrl(serverRoutes.orders, match.params.id);

            axios.get(url).then((res) => {
                if (res.data.message != undefined && res.data.message == 'success') {

                    setStatus(res.data.order.status);

                    const findC = customer.find(i => i.value == res.data.order.user);
                    setCustomerSelected(findC);

                    const dateCreated = new Date(res.data.order.createdAt);

                    const d = [
                        dateCreated.getFullYear(),
                        dateCreated.getMonth() + 1,
                        dateCreated.getDate() < 10 ? '0' + dateCreated.getDate() : dateCreated.getDate()
                    ];

                    setDatecreated(d.join('-'));
                    setHour(dateCreated.getHours());
                    setMin(dateCreated.getMinutes());

                    if (res.data.order.UserOrderBillings.length > 0) {
                        res.data.order.UserOrderBillings.forEach((i) => {
                            if (i.shipping) {
                                Object.keys(shipping).forEach(e => {
                                    shipping[e] = i[e]
                                })

                                setShipping(shipping);
                            } else {
                                Object.keys(billing).forEach(e => {
                                    billing[e] = i[e]
                                })

                                setBilling(billing);
                            }
                        })

                    }

                }
            });
        }
    }, []);

    const getUserIP = () => {

        const ipUrl = createServerUrl(serverRoutes.orders, "/ip1");

        try {
            axios.get(ipUrl).then(res => {
                setIp(res.data.IP);
            });

        } catch (err) {
            console.error(err);
        }
    }

    //Update
    const updateOrder = (e) => {
        e.preventDefault();
        console.log("Save Order");
    }

    const getCustomers = () => {
        const customersUrl = createServerUrl(serverRoutes.customers);

        try {
            axios.get(customersUrl).then((res) => {
                if (res.data.length > 0) {
                    setCustomerDetail(res.data);
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

    const filterColors = (inputValue) => {
        if (inputValue) {
            return customer.filter(i =>
                i.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        }
        return '';
    };

    //Async Select
    const loadOptions1 = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterColors(inputValue));
        }, 1000);
    };


    const saveOrder = () => {
        const data = {
            date_created: datecreated,
            hour: hour,
            min: min,
            status: status,
            customer: customerSelected.value,
            billing: billing,
            shipping: shipping
        }

        const updateUrl = createServerUrl(serverRoutes.orders, match.params.id + '/update');

        axios.post(updateUrl, data).then((res) => {
            if (res.data.message == undefined) {

            } else if (res.data.message == 'succcess') {
                alert("saved");
            } else if (res.data.message != undefined) {
                alert(res.data.message);
            }
        });

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
            if (shipping[k]) {
                return shipping[k];
            } else {
                return ""
            }
        }
    }

    const detailsChange = (e) => {
        const name = e.target.attributes.name.value;

        if (name == 'first_name') {
            setFirstName(e.target.value);
        } else if (name == 'last_name') {
            setLastName(e.target.value);
        } else if (name == 'email') {
            setEmail(e.target.value);
        } else if (name == 'phone') {
            setPhone(e.target.value);
        } else if (name == 'company') {
            setCompany(e.target.value);
        } else if (name == 'address_line_1') {
            setAddressLine1(e.target.value);
        } else if (name == 'address_line_2') {
            setAddressLine2(e.target.value);
        } else if (name == 'city') {
            setCity(e.target.value);
        } else if (name == 'post_code') {
            setPostCode(e.target.value);
        } else if (name == 'state') {
            setState(e.target.value);
        } else if (name == 'country') {
            setCountry(e.target.value);
        }
    }

    const resetBilling = (obj) => {
        Object.keys(obj).forEach(name => {
            if (name == 'first_name') {
                setFirstName(obj[name]);
            } else if (name == 'last_name') {
                setLastName(obj[name]);
            } else if (name == 'email') {
                setEmail(obj[name]);
            } else if (name == 'phone') {
                setPhone(obj[name]);
            } else if (name == 'company') {
                setCompany(obj[name]);
            } else if (name == 'address_line_1') {
                setAddressLine1(obj[name]);
            } else if (name == 'address_line_2') {
                setAddressLine2(obj[name]);
            } else if (name == 'city') {
                setCity(obj[name]);
            } else if (name == 'post_code') {
                setPostCode(obj[name]);
            } else if (name == 'state') {
                setState(obj[name]);
            } else if (name == 'country') {
                setCountry(obj[name]);
            }
        })
    }

    const saveProfile = () => {
        const d = {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone,
            "company": company,
            "address_line_1": addressLine1,
            "address_line_2": addressLine2,
            "city": city,
            "post_code": postCode,
            "state": state,
            "country": country,
        };

        if (modalBilling) {
            setBilling(d);
        } else if (modalShipping) {
            setShipping(d);
        }
    }

    const loadProfile = () => {
        if (modalBilling) {
            console.log("Billing");
        } else if (modalShipping) {
            console.log("Shipping");
        }
    }

    return (
        <div>
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
                                                    loadOptions={loadOptions1}
                                                    onChange={(e) => { console.log(['sdf', e]); setCustomerSelected(e) }}
                                                    value={customerSelected}
                                                />
                                            </CCol>
                                        </CRow>
                                    </div>
                                </CCol>
                                <CCol lg={4}>
                                    <CRow>
                                        <CCol lg={12}>
                                            <p><strong>Billing</strong> <FontAwesomeIcon onClick={() => { setModalBilling(true); setCopyBilling({ ...copyBilling, ...billing }); resetBilling(billing) }} icon={faEdit} /></p>
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
                                            </p>
                                        </CCol>
                                    </CRow>
                                </CCol>
                                <CCol lg={4}>
                                    <CRow>
                                        <CCol lg={12}>
                                            <p><strong>Shipping</strong> <FontAwesomeIcon onClick={() => {
                                                setModalShipping(true);
                                                setCopyShipping({ ...copyShipping, ...shipping });
                                                resetBilling(shipping)
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
                                            </p>
                                        </CCol>
                                    </CRow>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                    <OrderList orderid={match.params.id}></OrderList>
                </CCol>
                <CCol lg={3}>
                    <CCard>
                        <CCardBody>
                            <CButton block color="primary" onClick={saveOrder}>UPDATE</CButton>
                        </CCardBody>
                    </CCard>
                    {match.params.id > 0 &&
                        (
                            <CCard>
                                <CCardBody>
                                    <CommentBox orderid={match.params.id}></CommentBox>
                                </CCardBody>
                            </CCard>
                        )
                    }
                </CCol>
            </CRow>
            <CModal
                show={modalBilling || modalShipping}
                onClose={() => { setModalBilling(false); setModalShipping(false); }}
            >
                <CModalHeader closeButton>

                    <CModalTitle>
                        {modalBilling && "Billing"}
                        {modalShipping && "Shipping"}
                        <CButton color="primary" onClick={(e) => { loadProfile() }}>Load Profile {modalShipping && "Shipping"} {modalBilling && "Billing"}</CButton>
                        {modalShipping && (<CButton color="primary" onClick={(e) => { resetBilling(billing); }}>Copy From Billing</CButton>)}
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CForm>
                            <CCol xs="12">
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>First Name</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="first_name" value={firstName} placeholder="First Name" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Last Name</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="last_name" value={lastName} placeholder="Last Name" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Email</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="email" value={email} placeholder="Email" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Phone</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="phone" value={phone} placeholder="Phone" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Company</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="company" value={company} placeholder="Company" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Address Line 1</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="address_line_1" value={addressLine1} placeholder="Address Line 1" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Address Line 2</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="address_line_2" value={addressLine2} placeholder="Address Line 2" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>City</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="city" value={city} placeholder="City" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Post Code</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="post_code" value={postCode} placeholder="Post Code" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>State</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="state" value={state} placeholder="State" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CLabel>Country</CLabel>
                                    </CInputGroup>
                                    <CInputGroup>
                                        <CInput type="text" name="country" value={country} placeholder="Country" onChange={detailsChange}></CInput>
                                    </CInputGroup>
                                </CFormGroup>
                            </CCol>
                        </CForm>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => { saveProfile(); setModalBilling(false); setModalShipping(false); resetBilling(copyBilling) }}>Save</CButton>{' '}
                    <CButton
                        color="secondary"
                        onClick={() => {
                            { modalBilling && setBilling({ ...billing, ...copyBilling }) }
                            { modalShipping && setShipping({ ...shipping, ...copyShipping }) }
                            setModalBilling(false);
                            setModalShipping(false);
                            resetBilling(copyBilling)
                        }}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
        </div >
    )
}

export default Order;