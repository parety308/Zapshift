import React from 'react';

// Replace with real fetches, e.g. GET /admin/stats
const MOCK_STATS = {
    totalUsers: 1240,
    totalRiders: 86,
    totalParcels: 3520,
    parcelsInTransit: 214,
    revenueThisMonth: 186400,
};

const StatCard = ({ label, value, accent }) => (
    <div className={`border rounded-lg p-6 shadow-sm bg-base-100 border-t-4 ${accent}`}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
);

const AdminOverview = () => {
    const { totalUsers, totalRiders, totalParcels, parcelsInTransit, revenueThisMonth } = MOCK_STATS;

    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-6">Admin Overview</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="Total Users" value={totalUsers.toLocaleString()} accent="border-t-blue-400" />
                <StatCard label="Total Riders" value={totalRiders.toLocaleString()} accent="border-t-lime-500" />
                <StatCard label="Total Parcels" value={totalParcels.toLocaleString()} accent="border-t-amber-400" />
                <StatCard label="Parcels In Transit" value={parcelsInTransit.toLocaleString()} accent="border-t-purple-400" />
                <StatCard label="Revenue This Month" value={`৳${revenueThisMonth.toLocaleString()}`} accent="border-t-emerald-500" />
            </div>
        </div>
    );
};

export default AdminOverview;
