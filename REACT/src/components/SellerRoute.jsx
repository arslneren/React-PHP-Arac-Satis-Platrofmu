import React from 'react';
import { Navigate } from 'react-router-dom';

export default function SellerRoute({ children }) {
    
    const isLoggedIn = sessionStorage.getItem('loggedIn') === '1';
    const userStatus = sessionStorage.getItem('status');
    
    const isSeller = isLoggedIn && userStatus === '0';

    if (!isSeller) {
        return <Navigate to="/" replace />;
    }

    return children;
}