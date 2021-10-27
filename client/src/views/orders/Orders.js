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


const Products = () => {
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [orders, setOrders] = useState([])

    async function getProducts() {
        try {
            const url = createServerUrl(serverRoutes.orders);

            await axios.get(url, {
                page: 0
            }).then((res) => {
                console.log(res.data);
                if (res.data.order.length > 0) {
                    setOrders(res.data.order);
                }
            })
        } catch (err) {
            console.error(err);
        }
    }

    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/orders?page=${newPage}`)
    }

    useEffect(() => {
        currentPage !== page && setPage(currentPage)
        getProducts();
    }, [currentPage, page])

    return (
        <CRow>
            <CCol xl={6}>
                <CCard>
                    <CCardHeader>
                        Orders
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={orders}
                            fields={[
                                { key: 'Order Id', _classes: 'font-weight-bold' },
                                { key: 'Customer' },
                                { key: 'Status' },
                                { key: 'actions' },
                            ]}
                            hover
                            striped
                            itemsPerPage={5}
                            activePage={1}
                            clickableRows
                            onRowClick={(item) => history.push(`/admin/orders/${item.id}`)}
                            scopedSlots={{
                                'Order Id': (item) => {
                                    return (
                                        <td class="font-weight-bold">
                                            {item.id}
                                        </td>
                                    )
                                },
                                'Customer': (item) => {
                                    return (
                                        <td>
                                            {item.UserOrderBillings.length > 0 && item.UserOrderBillings[0].first_name + ' ' + item.UserOrderBillings[0].last_name}
                                        </td>
                                    )
                                },
                                'Status': (item) => {
                                    return (
                                        <td>
                                            {item.status}
                                        </td>
                                    )
                                },
                                'actions':
                                    (item) => {
                                        const href = process.env.REACT_APP_PUBLIC_URL + + `/admin/orders/${item.id}`;
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
                            activePage={1}
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

export default Products
