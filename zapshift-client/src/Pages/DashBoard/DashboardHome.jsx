import React from 'react';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth/useAuth';

const cards = {
    user: [
        { to: '/dashboard/my-parcels', title: 'My Parcels', desc: 'Track and manage the parcels you have booked.' },
        { to: '/dashboard/payment-history', title: 'Payment History', desc: 'Review your past payments and invoices.' },
        { to: '/send-parcel', title: 'Send a Parcel', desc: 'Book a new pickup in a few clicks.' },
    ],
    rider: [
        { to: '/dashboard/rider/pending-deliveries', title: 'Pending Deliveries', desc: 'Parcels assigned to you that are awaiting delivery.' },
        { to: '/dashboard/rider/completed-deliveries', title: 'Completed Deliveries', desc: 'Your delivery history.' },
        { to: '/dashboard/rider/my-earnings', title: 'My Earnings', desc: 'Track how much you have earned per delivery.' },
    ],
    admin: [
        { to: '/dashboard/admin/overview', title: 'Overview', desc: 'Key metrics across users, riders, and parcels.' },
        { to: '/dashboard/admin/all-parcels', title: 'All Parcels', desc: 'Every parcel booked on the platform.' },
        { to: '/dashboard/admin/manage-riders', title: 'Manage Riders', desc: 'Approve, suspend, or review riders.' },
        { to: '/dashboard/admin/assign-rider', title: 'Assign Rider', desc: 'Assign an unassigned parcel to a rider.' },
        { to: '/dashboard/admin/manage-users', title: 'Manage Users', desc: 'View and manage every registered user.' },
    ],
};

const DashboardHome = () => {
    const { user } = useAuth();
    const role = user?.role || 'user';
    const items = cards[role] || cards.user;

    return (
        <div className="w-11/12 mx-auto my-10">
            <h1 className="text-3xl font-bold mb-2">
                Welcome{user?.displayName ? `, ${user.displayName}` : ''}
            </h1>
            <p className="text-gray-500 mb-8 capitalize">Role: {role}</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="border rounded-lg p-6 shadow-sm bg-base-100 hover:bg-primary/20 transition-colors"
                    >
                        <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DashboardHome;
