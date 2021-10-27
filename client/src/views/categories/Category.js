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

const Category = ({ match }) => {

    const [title, setTitle] = useState(match.params.id);
    const [errormsg, setErrormsg] = useState("");
    const [successmsg, setSuccessmsg] = useState("");

    const [name, setName] = useState("");
    const [parent, setParent] = useState(0);
    const [parents, setParents] = useState("");


    function getParentList() {
        const categoriesUrl = createServerUrl(serverRoutes.categories);

        try {
            axios.get(categoriesUrl).then((res) => {
                if (res.data) {
                    const defaultValue = [
                        (<option key={0} value={0}>{"Choose a parent"}</option>)
                    ];

                    const data = res.data.map((i) => {
                        if (i.id != match.params.id) {
                            return (<option key={i.id} value={i.id}>{i.name}</option>)
                        }
                    });

                    setParents([defaultValue, ...data]);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    function getCategory(id) {
        const categoryUrl = createServerUrl(serverRoutes.categories, id);

        try {
            axios.get(categoryUrl).then((res) => {
                if (res.data.category) {
                    setName(res.data.category.name);
                    setParent(res.data.category.parent);
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

    const parentOnChange = (e) => {
        setParent(e.target.value);
    }

    useEffect(() => {
        if (match.params.id > 0) {
            setTitle("Edit Category");
            getCategory(match.params.id);
            getParentList();
        } else {
            setTitle("Add New Category");
            setName("")
            setParent(0)
            getParentList();
        }
    }, [])

    const updateAttributes = (e) => {
        e.preventDefault();


        var iD = match.params.id;
        console.log(iD);
        if (iD == undefined) {
            iD = 0;
        }

        const url = createServerUrl(serverRoutes.categories, iD);

        axios.post(url, {
            name: name,
            parent: parseInt(parent),
        }).then((res) => {
            console.log(res);

            if (res.data.error) {
                setErrormsg(res.data.error);
            } else if (res.data.category) {
                if (match.params.id > 0) {

                } else {
                    history.push(`/admin/categories/${res.data.category}`);
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
                            <CLabel htmlFor="basic-url">Parents</CLabel>
                            <CInputGroup className="mb-4">
                                <CSelect custom name="type" id="type" value={parent} onChange={parentOnChange}>
                                    {parents}
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

export default Category;
