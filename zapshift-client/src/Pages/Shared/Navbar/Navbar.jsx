import React from 'react';
import { Link, NavLink } from 'react-router';
import Logo from '../../../component/Logo/Logo';
import useAuth from '../../../hooks/useAuth/useAuth';

const Navbar = () => {
    const { user, logout, setUser } = useAuth();

    const handleLogOut = () => {
        logout()
            .then(() => setUser(null))
            .catch((err) => console.log(err));
    };

    const links = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/coverage">Coverage</NavLink></li>
            <li><NavLink to="/send-parcel">Send Parcel</NavLink></li>
            {user && <li><NavLink to="/dashboard/my-parcels">My Parcels</NavLink></li>}
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl"><Logo /></Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">{links}</ul>
            </div>

            <div className="navbar-end flex gap-4">
                {user ? (
                    <>
                        <span className="hidden md:inline text-sm">Hi, {user.displayName || user.email}</span>
                        <button onClick={handleLogOut} className="btn bg-lime-300">Sign Out</button>
                        <NavLink to="/be-rider" className="btn bg-lime-300 hidden sm:inline-flex">Be a Rider</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/auth/login" className="btn bg-lime-300">Login</NavLink>
                        <NavLink to="/be-rider" className="btn bg-lime-300 hidden sm:inline-flex">Be a Rider</NavLink>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
