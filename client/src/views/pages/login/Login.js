import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import AuthContext from "../../../context/AuthContext";

import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

/**
 * Need to do errors
 */

function Login(props) {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errormsg, setErrormsg] = useState("");

    const { loggedIn, getLoggedIn } = useContext(AuthContext);

    const history = useHistory();

    useEffect(() => {
        // Runs after EVERY rendering
        if (loggedIn) {
            if (loggedIn.user.role == 'administrator') {
                history.push('/admin');
            } else {
                history.push('/');
            }
        }
    });


    const success = new URLSearchParams(props.location.search).get("success");
    const [successmsg, setSuccessmsg] = useState(success == 1 ? "Your account has been successfully registered" : "");


    const passwordOnChange = (e) => {
        setPassword(e.target.value);
    }

    const emailOnChange = (e) => {
        setEmail(e.target.value);
    }

    async function login(e) {
        e.preventDefault();
        const data = { email: email, password: password };

        const url = "http://localhost:5000/auth/login";

        try {
            await axios.post(url, data).then(async (res) => {
                console.log(res.data.error);
                if (res.data.error) {
                    await setErrormsg(res.data.error);
                    console.log(errormsg);
                } else {
                    await getLoggedIn();
                    if (loggedIn) {
                        if (loggedIn.user.role == 'administrator') {
                            history.push('/admin');
                        } else {
                            history.push('/');
                        }
                    }
                }
            });

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="c-app c-default-layout flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md="8">
                        <CCardGroup>
                            <CCard className="p-4">
                                <p>{errormsg}</p>
                                <p>{successmsg}</p>
                                <CCardBody>
                                    <CForm onSubmit={login}>
                                        <h1>Login</h1>
                                        <p className="text-muted">Sign In to your account</p>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-user" />
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="text" placeholder="Email" autoComplete="email" onChange={emailOnChange} />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-lock-locked" />
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="password" placeholder="Password" autoComplete="current-password" onChange={passwordOnChange} />
                                        </CInputGroup>
                                        <CRow>
                                            <CCol xs="6">
                                                <CButton color="primary" className="px-4" type="submit">Login</CButton>
                                            </CCol>
                                            <CCol xs="6" className="text-right">
                                                <CButton color="link" className="px-0">Forgot password?</CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                            <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                                <CCardBody className="text-center">
                                    <div>
                                        <h2>Sign up</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                                            labore et dolore magna aliqua.</p>
                                        <Link to="/register">
                                            <CButton color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                                        </Link>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}


export default Login;
