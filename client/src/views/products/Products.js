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


const Products = () => {
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [products, setProducts] = useState([])

    async function getProducts() {
        try {
            const url = "http://localhost:5000/products/";

            await axios.get(url, {
                page: 0
            }).then((res) => {
                console.log(res.data);
                setProducts(res.data);
            })
        } catch (err) {
            console.error(err);
        }
    }

    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/products?page=${newPage}`)
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
                        Products
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={products}
                            fields={[
                                { key: 'name', _classes: 'font-weight-bold' },
                                { key: 'title' },
                                { key: 'sku' },
                                { key: 'regular_price' },
                                { key: 'sale_price' },
                                { key: 'actions' },
                            ]}
                            hover
                            striped
                            itemsPerPage={5}
                            activePage={1}
                            clickableRows
                            onRowClick={(item) => history.push(`/admin/products/${item.id}`)}
                            scopedSlots={{
                                'actions':
                                    (item) => {
                                        const href = `http://localhost:3000/admin/attributes/${item.id}`;
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
