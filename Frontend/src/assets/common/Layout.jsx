import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;