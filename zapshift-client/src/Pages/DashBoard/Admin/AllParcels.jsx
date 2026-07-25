import React from 'react';

// Replace with a real fetch, e.g. GET /admin/parcels
const MOCK_ALL_PARCELS = [
    { _id: 'ap1', parcelName: 'Documents Envelope', senderEmail: 'karim@example.com', cost: 80, deliveryStatus: 'in-transit' },
    { _id: 'ap2', parcelName: 'Electronics Box', senderEmail: 'nusrat@example.com', cost: 220, deliveryStatus: 'pending' },
    { _id: 'ap3', parcelName: 'Grocery Box', senderEmail: 'sadia@example.com', cost: 130, deliveryStatus: 'delivered' },
    { _id: 'ap4', parcelName: 'Furniture Part', senderEmail: 'rafiq@example.com', cost: 300, deliveryStatus: 'pending' },
];

const statusColor = {
    delivered: 'badge-success',
    'in-transit': 'badge-info',
    pending: 'badge-warning',
};

const AllParcels = () => {
    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-6">All Parcels — {MOCK_ALL_PARCELS.length}</h2>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th className="text-center">Parcel</th>
                            <th className="text-center">Sender</th>
                            <th className="text-center">Cost</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_ALL_PARCELS.map((p) => (
                            <tr key={p._id}>
                                <td className="text-center">{p.parcelName}</td>
                                <td className="text-center">{p.senderEmail}</td>
                                <td className="text-center">৳{p.cost}</td>
                                <td className="text-center">
                                    <span className={`badge ${statusColor[p.deliveryStatus]} text-white capitalize`}>
                                        {p.deliveryStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllParcels;
