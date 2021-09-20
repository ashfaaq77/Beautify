import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from "axios";

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CPagination,
    CButton,
} from '@coreui/react';


const Categories = () => {
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [categories, setCategories] = useState([])

    async function getAttributes(page) {
        try {
            const url = "http://localhost:5000/categories/";

            await axios.get(url, {
                page: page
            }).then((res) => {
                let parents = {}
                res.data.forEach((i, k) => {
                    parents[i.id] = i.name;
                });
                setCategories(res.data.map((i) => {
                    if (i.parent > 0) {
                        i.parent = parents[i.parent];
                    } else {
                        i.parent = "No Parent";
                    }
                    return i;
                }))
                // setCategories(res.data);
            })
        } catch (err) {
            console.error(err);
        }
    }

    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/categories?page=${newPage}`)
    }

    useEffect(() => {
        currentPage !== page && setPage(currentPage)
        getAttributes(page);
    }, [currentPage, page])

    return (
        <CRow>
            <CCol xl={6}>
                <CCard>
                    <CCardHeader>
                        Attributes
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={categories}
                            fields={[
                                { key: 'name', _classes: 'font-weight-bold' },
                                { key: 'parent' },
                                { key: 'actions' },
                            ]}
                            hover
                            striped
                            itemsPerPage={5}
                            activePage={page}
                            clickableRows
                            onRowClick={(item) => history.push(`/admin/categories/${item.id}`)}
                            scopedSlots={{
                                'actions':
                                    (item) => {
                                        const href = `http://localhost:3000/admin/categories/${item.id}`;
                                        return (
                                            <td>
                                                <CButton size="sm" color="success">
                                                    <small className="text-muted">View</small>
                                                </CButton>
                                            </td>
                                        )
                                    }
                            }}
                        />
                        <CPagination
                            activePage={page}
                            onActivePageChange={pageChange}
                            pages={5}
                            doubleArrows={false}
                            align="center"
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Categories
