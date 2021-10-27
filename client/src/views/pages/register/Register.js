import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";

import serverRoutes from "../../../points";
import createServerUrl from "../../../inc/functions";

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
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

const Register = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordverify, setPasswordverify] = useState("");
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");

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

  const emailOnChange = (e) => {
    setEmail(e.target.value);
  }

  const passwordOnChange = (e) => {
    setPassword(e.target.value);
  }

  const passwordverifyOnChange = (e) => {
    setPasswordverify(e.target.value);
  }

  const firstnameOnChange = (e) => {
    setFirstname(e.target.value);
  }

  const lastnameOnChange = (e) => {
    setLastname(e.target.value);
  }

  const register = (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
      passwordVerify: passwordverify,
      first_name: first_name,
      last_name: last_name,
    };

    const url = createServerUrl(serverRoutes.register);

    axios.post(url, data).then((res) => {
      if (res.data.error) {
        setErrormsg(res.data.error);
      } else {
        //success
        history.push("/?success=1");
      }
    });
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <p>{errormsg}</p>
                <CForm onSubmit={register}>
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Email" autoComplete="email" onChange={emailOnChange} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Password" autoComplete="new-password" onChange={passwordOnChange} />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Repeat password" autoComplete="new-password" onChange={passwordverifyOnChange} />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="First Name" autoComplete="first_name" onChange={firstnameOnChange} />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Last Name" autoComplete="last_name" onChange={lastnameOnChange} />
                  </CInputGroup>
                  <CButton color="success" type="submit" block>Create Account</CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
