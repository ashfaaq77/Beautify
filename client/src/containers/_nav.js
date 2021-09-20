import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    badge: {
      color: 'info',
    }
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Users']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'User',
    route: '/admin/users',
    icon: 'cil-user',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'All Users',
        to: '/admin/users',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Add User',
        to: '/admin/users/new',
      },
    ],
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Product']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Product',
    route: '/admin/products',
    icon: 'cil-barcode',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'All Products',
        to: '/admin/products',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Add Product',
        to: '/admin/products/new',
      },
    ],
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Attributes']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Attributes',
    route: '/admin/attributes',
    icon: 'cil-barcode',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'All Attributes',
        to: '/admin/attributes',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Add Attribute',
        to: '/admin/attributes/new',
      },
    ],
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Categories']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Categories',
    route: '/admin/categories',
    icon: 'cil-barcode',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'All Categories',
        to: '/admin/categories',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Add Categories',
        to: '/admin/categories/new',
      },
    ],
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Orders']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Orders',
    route: '/admin/orders',
    icon: 'cil-inbox',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'All Orders',
        to: '/admin/orders',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Add Order',
        to: '/admin/orders/new',
      },
    ],
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Settings']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Settings',
    to: '/admin/settings',
    icon: <CIcon name="cil-settings" customClasses="c-sidebar-nav-icon" />,
  },
]

export default _nav
