import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import Logo from '../../component/Logo/Logo';
import useAuth from '../../hooks/useAuth/useAuth';
import { CiDeliveryTruck } from 'react-icons/ci';
import { MdPayment, MdOutlineDashboard, MdOutlineAssignmentInd } from 'react-icons/md';
import { FaMotorcycle, FaClipboardCheck, FaWallet, FaUsers, FaUserShield, FaBoxes } from 'react-icons/fa';

// Sidebar links per role. Add/remove entries here to change what each
// role sees — everything else in this layout stays the same.
const roleLinks = {
    user: [
        { to: '/dashboard', end: true, label: 'Overview', icon: <MdOutlineDashboard /> },
        { to: '/dashboard/my-parcels', label: 'My Parcels', icon: <CiDeliveryTruck /> },
        { to: '/dashboard/payment-history', label: 'Payment History', icon: <MdPayment /> },
    ],
    rider: [
        { to: '/dashboard', end: true, label: 'Overview', icon: <MdOutlineDashboard /> },
        { to: '/dashboard/rider/pending-deliveries', label: 'Pending Deliveries', icon: <FaMotorcycle /> },
        { to: '/dashboard/rider/completed-deliveries', label: 'Completed Deliveries', icon: <FaClipboardCheck /> },
        { to: '/dashboard/rider/my-earnings', label: 'My Earnings', icon: <FaWallet /> },
    ],
    admin: [
        { to: '/dashboard', end: true, label: 'Overview', icon: <MdOutlineDashboard /> },
        { to: '/dashboard/admin/all-parcels', label: 'All Parcels', icon: <FaBoxes /> },
        { to: '/dashboard/admin/manage-riders', label: 'Manage Riders', icon: <FaMotorcycle /> },
        { to: '/dashboard/admin/assign-rider', label: 'Assign Rider', icon: <MdOutlineAssignmentInd /> },
        { to: '/dashboard/admin/manage-users', label: 'Manage Users', icon: <FaUsers /> },
    ],
};

const roleBadge = {
    user: 'badge-info',
    rider: 'badge-warning',
    admin: 'badge-error',
};

const DashBoard = () => {
    const { user } = useAuth();
    const role = user?.role || 'user';
    const links = roleLinks[role] || roleLinks.user;

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <nav className="navbar w-full bg-base-300">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                            <path d="M9 4v16"></path>
                            <path d="M14 10l2 2l-2 2"></path>
                        </svg>
                    </label>
                    <div className="px-4 flex items-end gap-3">
                        <Logo />
                        <h1 className="text-3xl font-bold">DashBoard</h1>
                        <span className={`badge ${roleBadge[role]} text-white capitalize mb-1`}>
                            <FaUserShield className="mr-1" /> {role}
                        </span>
                    </div>
                </nav>
                <Outlet />
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    <ul className="menu w-full grow">
                        <li>
                            <Link to="/" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                </svg>
                                <span className="is-drawer-close:hidden text-lime-600">Homepage</span>
                            </Link>
                        </li>

                        <div className="divider my-1 is-drawer-close:hidden"></div>

                        {links.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    end={link.end}
                                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                                    data-tip={link.label}
                                >
                                    {link.icon}
                                    <span className="is-drawer-close:hidden text-lime-600">{link.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
