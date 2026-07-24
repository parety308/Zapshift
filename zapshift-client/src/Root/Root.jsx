import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import Footer from '../Pages/Shared/Footer/Footer';

const Root = () => {
    return (
        <div className="max-w-12/13 mx-auto">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Root;
