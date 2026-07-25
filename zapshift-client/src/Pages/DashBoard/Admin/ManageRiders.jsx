import React, { useState } from 'react';
import Swal from 'sweetalert2';

// Replace with a real fetch, e.g. GET /admin/riders
const MOCK_RIDERS = [
    { _id: 'r1', name: 'Tanvir Ahmed', email: 'tanvir@example.com', region: 'Dhaka', status: 'pending' },
    { _id: 'r2', name: 'Shakil Rana', email: 'shakil@example.com', region: 'Chattogram', status: 'active' },
    { _id: 'r3', name: 'Imran Kabir', email: 'imran@example.com', region: 'Sylhet', status: 'active' },
];

const ManageRiders = () => {
    const [riders, setRiders] = useState(MOCK_RIDERS);

    const handleApprove = (id) => {
        // Hook this up to your backend, e.g. axiosSecure.patch(`/admin/riders/${id}/approve`)
        setRiders((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'active' } : r)));
    };

    const handleRemove = (id) => {
        Swal.fire({
            title: 'Remove this rider?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove',
        }).then((result) => {
            if (result.isConfirmed) {
                // Hook this up to your backend, e.g. axiosSecure.delete(`/admin/riders/${id}`)
                setRiders((prev) => prev.filter((r) => r._id !== id));
            }
        });
    };

    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-6">Manage Riders — {riders.length}</h2>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Name</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Region</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riders.map((r) => (
                            <tr key={r._id}>
                                <td className="text-center">{r.name}</td>
                                <td className="text-center">{r.email}</td>
                                <td className="text-center">{r.region}</td>
                                <td className="text-center">
                                    <span className={`badge ${r.status === 'active' ? 'badge-success' : 'badge-warning'} text-white`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="text-center flex flex-wrap gap-2 justify-center">
                                    {r.status === 'pending' && (
                                        <button onClick={() => handleApprove(r._id)} className="btn btn-sm bg-lime-300">Approve</button>
                                    )}
                                    <button onClick={() => handleRemove(r._id)} className="btn btn-sm btn-error text-white">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRiders;
