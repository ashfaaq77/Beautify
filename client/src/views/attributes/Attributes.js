import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from "axios";

import serverRoutes from "../../points";
import createServerUrl from "../../inc/functions";

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


const Attributes = () => {
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [attributes, setAttributes] = useState([])

    async function getAttributes(page) {
        try {
            const url = createServerUrl(serverRoutes.attributes);

            await axios.get(url, {
                page: page
            }).then((res) => {
                console.log(res.data);
                setAttributes(res.data);
            })
        } catch (err) {
            console.error(err);
        }
    }

    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/attributes?page=${newPage}`)
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
                            items={attributes}
                            fields={[
                                { key: 'name', _classes: 'font-weight-bold' },
                                { key: 'type' },
                                { key: 'actions' },
                            ]}
                            hover
                            striped
                            itemsPerPage={5}
                            activePage={page}
                            clickableRows
                            onRowClick={(item) => history.push(`/admin/attributes/${item.id}`)}
                            scopedSlots={{
                                'actions':
                                    (item) => {
                                        const href = process.env.REACT_APP_PUBLIC_URL + `/admin/attributes/${item.id}`;
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

export default Attributes
