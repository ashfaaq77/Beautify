import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

//Users
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));

const Attributes = React.lazy(() => import('./views/attributes/Attributes'));
const Attribute = React.lazy(() => import('./views/attributes/Attribute'));

const Category = React.lazy(() => import('./views/categories/Category'));
const Categories = React.lazy(() => import('./views/categories/Categories'));

const Product = React.lazy(() => import('./views/products/Product'));
const Products = React.lazy(() => import('./views/products/Products'));

const Order = React.lazy(() => import('./views/orders/Order'));


const adminRoutes = [
  { path: '/admin', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/admin/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/admin/users', exact: true, name: 'Users', component: Users },
  { path: '/admin/users/new', exact: true, name: 'New User', component: User },
  { path: '/admin/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/admin/attributes', exact: true, name: 'Attributes', component: Attributes },
  { path: '/admin/attributes/new', exact: true, name: 'New Attribute', component: Attribute },
  { path: '/admin/attributes/:id', exact: true, name: 'Attribute Details', component: Attribute },
  { path: '/admin/categories', exact: true, name: 'Categories', component: Categories },
  { path: '/admin/categories/new', exact: true, name: 'New Category', component: Category },
  { path: '/admin/categories/:id', exact: true, name: 'Category Details', component: Category },
  { path: '/admin/products/new', exact: true, name: 'New Product', component: Product },
  { path: '/admin/products/:id', exact: true, name: 'Product', component: Product },
  { path: '/admin/products/', exact: true, name: 'Products', component: Products },
  { path: '/admin/orders/new', exact: true, name: 'Order', component: Order },
];



const routes = [];


export { adminRoutes, routes };
