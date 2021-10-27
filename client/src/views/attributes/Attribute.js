import React, { useState, useContext, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import axios from "axios";
import { useHistory } from "react-router-dom";
// import AuthContext from "../../context/AuthContext";

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
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow,
    CTextarea,
    CLabel
} from '@coreui/react';

const Attribute = ({ match }) => {

    const [title, setTitle] = useState(match.params.id);
    const [errormsg, setErrormsg] = useState("");
    const [successmsg, setSuccessmsg] = useState("");

    const [name, setName] = useState("");
    const [values, setValues] = useState("");
    const [type, setType] = useState("dropdown");

    function getAttribute(id) {
        const attributeUrl = createServerUrl(serverRoutes.attributes, id);

        try {
            axios.get(attributeUrl).then((res) => {
                if (res.data.attribute) {
                    const attribute = res.data.attribute;
                    setName(attribute.name);
                    if (attribute.values) {
                        setValues(attribute.values)
                    }
                    setType(attribute.type);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    const history = useHistory();

    const nameOnChange = (e) => {
        setName(e.target.value);
    }

    const valuesOnChange = (e) => {
        setValues(e.target.value);
    }

    const typeOnChange = (e) => {
        setType(e.target.value);
    }

    useEffect(() => {
        if (match.params.id > 0) {
            setTitle("Edit Attribute");
            getAttribute(match.params.id);
        } else {
            setTitle("Add New Attribute");
            setName("");
            setValues("");
            setType("dropdown");
        }
    }, [])

    const updateAttributes = (e) => {
        e.preventDefault();

        var iD = match.params.id;
        if (match.params.id == undefined) {
            iD = 0;
        }


        const url = createServerUrl(serverRoutes.attributes, iD);

        axios.post(url, {
            name: name,
            type: type,
            values: values,
        }).then((res) => {
            console.log(res);

            if (res.data.error) {
                setErrormsg(res.data.error);
            } else if (res.data.attribute) {
                if (match.params.id > 0) {

                } else {
                    history.push(`/admin/attributes/${res.data.attribute}`);
                }
            } else {
                setErrormsg(res.data.join(' , '));
            }
        });
    }

    return (
        <CRow>
            <CCol lg={6}>
                <CCard>
                    <CCardBody>
                        <CForm onSubmit={updateAttributes}>
                            <h5>{title}</h5>
                            <p>{successmsg}</p>
                            <p>{errormsg}</p>
                            <CLabel htmlFor="basic-url">Name</CLabel>
                            <CInputGroup className="mb-4">
                                <CInput type="text" placeholder="Name" value={name} onChange={nameOnChange} />
                            </CInputGroup>
                            <CLabel htmlFor="basic-url">Type of Attributes</CLabel>
                            <CInputGroup className="mb-4">
                                <CSelect custom name="type" id="type" value={type} onChange={typeOnChange}>
                                    <option value="dropdown">Dropdown</option>
                                    <option value="text">text</option>
                                </CSelect>
                            </CInputGroup>
                            {type == 'dropdown' &&
                                (
                                    <div>
                                        <CLabel htmlFor="basic-url">Values should in this format : Label:Value </CLabel>
                                        <CInputGroup className="mb-4">
                                            <CTextarea
                                                onChange={valuesOnChange}
                                                value={values}
                                                name="textarea-input"
                                                id="textarea-input"
                                                rows="9"
                                                placeholder="Values"
                                            />
                                        </CInputGroup>
                                    </div>
                                )
                            }
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

export default Attribute
