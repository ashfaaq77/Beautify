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

import CIcon from '@coreui/icons-react'


import usersData from './UsersData'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}


const Users = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [users, setUsers] = useState([])

  async function getUsers(page) {
    try {
      const url = createServerUrl(serverRoutes.authUser, "all");

      await axios.get(url, {
        page: page
      }).then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
    } catch (err) {
      console.error(err);
    }
  }

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
    getUsers();
  }, [currentPage, page])

  return (
    <CRow>
      <CCol xl={6}>
        <CCard>
          <CCardHeader>
            Users
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={users}
              fields={[
                { key: 'first_name', _classes: 'font-weight-bold' },
                { key: 'last_name' },
                { key: 'email' },
                { key: 'role' },
                { key: 'actions' },
              ]}
              hover
              striped
              itemsPerPage={5}
              activePage={page}
              clickableRows
              onRowClick={(item) => history.push(`/admin/users/${item.id}`)}
              scopedSlots={{
                'actions':
                  (item) => {
                    const href = process.env.REACT_APP_PUBLIC_URL + `/admin/users/${item.id}`;
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

export default Users
