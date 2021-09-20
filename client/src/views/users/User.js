import React, { useState, useContext, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import axios from "axios";
import { useHistory } from "react-router-dom";
// import AuthContext from "../../context/AuthContext";

import {
    CButton,
    CCard,
    CCardBody,
    CSelect,
    CCol,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow
} from '@coreui/react';

const User = ({ match }) => {

    const [title, setTitle] = useState(match.params.id);
    const [errormsg, setErrormsg] = useState("");
    const [successmsg, setSuccessmsg] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [role, setRole] = useState('customer');
    const [repeatpassword, setpasswordRepeat] = useState("");
    const [passwordnew, setpasswordNew] = useState("");

    function getUser(id) {
        const userUrl = "http://localhost:5000/auth/user/" + id;
        try {
            axios.get(userUrl).then((res) => {
                setEmail(res.data.email);
                setFirstname(res.data.first_name);
                setLastname(res.data.last_name);
                setRole(res.data.role);
            });
        } catch (err) {
            console.error(err);
        }
    }

    const history = useHistory();

    const emailOnChange = (e) => {
        setEmail(e.target.value);
    }

    const passwordOnChange = (e) => {
        setPassword(e.target.value);
    }

    const firstnameOnChange = (e) => {
        setFirstname(e.target.value);
    }

    const lastnameOnChange = (e) => {
        setLastname(e.target.value);
    }

    const roleOnChange = (e) => {
        setRole(e.target.value);
    }

    const passwordrepeatOnChange = (e) => {
        setpasswordRepeat(e.target.value);
    }

    const passwordnewOnChange = (e) => {
        setpasswordNew(e.target.value);
    }

    useEffect(() => {
        if (match.params.id > 0) {
            setTitle(`Edit User`);
            getUser(match.params.id);
        } else {
            setTitle(`Add New User`);
            setEmail("");
            setPassword("");
            setFirstname("");
            setLastname("");
            setRole('customer');
            setpasswordRepeat("");
            setpasswordNew("");
        }
    }, [])

    const updateUserDetails = (e) => {
        e.preventDefault();

        if (match.params.id > 0) {
            //update user
            const url = "http://localhost:5000/auth/user/details";

            axios.post(url, {
                email: email,
                first_name: firstname,
                last_name: lastname
            }).then((res) => {
                if (res.data.error) {
                    setErrormsg(res.data.error);
                    setSuccessmsg("");
                    console.log(errormsg);
                } else if (res.data.user) {
                    const roleUrl = "http://localhost:5000/auth/user/role";
                    axios.post(roleUrl, {
                        role: role,
                        userid: match.params.id
                    }).then((res) => {
                        if (res.data.error) {
                            setErrormsg(res.data.error);
                            setSuccessmsg("");
                        } else if (res.data.user) {
                            if (passwordnew != "") {
                                const passwordUrl = "http://localhost:5000/auth/user/" + match.params.id + "/password";
                                axios.post(passwordUrl, {
                                    password: passwordnew,
                                    passwordVerify: repeatpassword
                                }).then((res) => {
                                    if (res.data.user) {
                                        setSuccessmsg("User Successfully Updated");
                                        setErrormsg("");
                                        setPassword("");
                                        setpasswordRepeat("");
                                        setpasswordNew("");
                                    } else {
                                        if (res.data.error) {
                                            setErrormsg(res.data.error);
                                            setSuccessmsg("");
                                        } else {
                                            setErrormsg(res.data.join(" , "));
                                            setSuccessmsg("");
                                        }
                                    }
                                });
                            } else {
                                setSuccessmsg("User Successfully Updated");
                                setErrormsg("");
                            }
                        } else {
                            setErrormsg(res.data.join(' , '));
                            setSuccessmsg("");
                        }
                    })
                } else {
                    setErrormsg(res.data.join(' , '));
                    setSuccessmsg("");
                }
            });
        } else {
            //create a new user
            const url = "http://localhost:5000/auth/";

            axios.post(url, {
                email: email,
                password: password,
                passwordVerify: password,
                first_name: firstname,
                last_name: lastname
            }).then((res) => {
                console.log(res);
                if (res.data.error) {
                    setErrormsg(res.data.error);
                    console.log(errormsg);
                } else if (res.data.user) {
                    const roleUrl = "http://localhost:5000/auth/user/role";
                    axios.post(roleUrl, {
                        role: role,
                        userid: res.data.user
                    }).then((res) => {
                        if (res.data.error) {
                            setErrormsg(res.data.error);
                        } else if (res.data.user) {
                            console.log(res);
                            history.push(`http://localhost:3000/admin/users/${res.data.user}`);
                        } else {
                            setErrormsg(res.data.join(' , '));
                            setSuccessmsg("");
                        }
                    })
                }
            });
        }
    }

    return (
        <CRow>
            <CCol lg={6}>
                <CCard>
                    <CCardBody>
                        <CForm onSubmit={updateUserDetails}>
                            <h5>{title}</h5>
                            <p>{successmsg}</p>
                            <p>{errormsg}</p>
                            <CInputGroup className="mb-3">
                                <CInputGroupPrepend>
                                    <CInputGroupText>
                                        <CIcon name="cil-user" />
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CInput type="email" placeholder="Email" value={email} onChange={emailOnChange} />
                            </CInputGroup>
                            <CInputGroup className="mb-4">
                                <CInputGroupPrepend>
                                    <CInputGroupText>
                                        <CIcon name="cil-lock-locked" />
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CInput type="password" placeholder="Password" value={password} onChange={passwordOnChange} />
                            </CInputGroup>
                            {match.params.id > 0 && (
                                <div>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupPrepend>
                                            <CInputGroupText>
                                                <CIcon name="cil-lock-locked" />
                                            </CInputGroupText>
                                        </CInputGroupPrepend>
                                        <CInput type="password" placeholder="New Password" value={passwordnew} onChange={passwordnewOnChange} />
                                    </CInputGroup>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupPrepend>
                                            <CInputGroupText>
                                                <CIcon name="cil-lock-locked" />
                                            </CInputGroupText>
                                        </CInputGroupPrepend>
                                        <CInput type="password" placeholder="Repeat Password" value={repeatpassword} onChange={passwordrepeatOnChange} />
                                    </CInputGroup>
                                </div>
                            )}
                            <CInputGroup className="mb-4">
                                <CInputGroupPrepend>
                                    <CInputGroupText>
                                        <CIcon name="cil-lock-locked" />
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CInput type="text" placeholder="First Name" value={firstname} onChange={firstnameOnChange} />
                            </CInputGroup>
                            <CInputGroup className="mb-4">
                                <CInputGroupPrepend>
                                    <CInputGroupText>
                                        <CIcon name="cil-lock-locked" />
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CInput type="text" placeholder="Last Name" value={lastname} onChange={lastnameOnChange} />
                            </CInputGroup>
                            <CInputGroup className="mb-4">
                                <CInputGroupPrepend>
                                    <CInputGroupText>
                                        <CIcon name="cil-lock-locked" />
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CSelect custom name="role" id="role" value={role} onChange={roleOnChange}>
                                    <option value="customer">Customer</option>
                                    <option value="administrator">Administrator</option>
                                </CSelect>
                            </CInputGroup>
                            <CRow>
                                <CCol xs="12">
                                    <CButton color="primary" className="px-4" type="submit">{title}</CButton>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow >
    )
}

export default User
