import React, { useState } from 'react';
import Swal from 'sweetalert2';

// Replace with a real fetch, e.g. GET /admin/users
const MOCK_USERS = [
    { _id: 'u1', name: 'Karim Hossain', email: 'karim@example.com', role: 'user', status: 'active' },
    { _id: 'u2', name: 'Nusrat Jahan', email: 'nusrat@example.com', role: 'user', status: 'active' },
    { _id: 'u3', name: 'Tanvir Ahmed', email: 'tanvir@example.com', role: 'rider', status: 'active' },
    { _id: 'u4', name: 'Farhana Rahman', email: 'farhana@example.com', role: 'user', status: 'suspended' },
];

const ManageUsers = () => {
    const [users, setUsers] = useState(MOCK_USERS);

    const handleToggleStatus = (id) => {
        // Hook this up to your backend, e.g. axiosSecure.patch(`/admin/users/${id}/status`)
        setUsers((prev) =>
            prev.map((u) => (u._id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
        );
    };

    const handleMakeAdmin = (id) => {
        Swal.fire({
            title: 'Promote to admin?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, promote',
        }).then((result) => {
            if (result.isConfirmed) {
                // Hook this up to your backend, e.g. axiosSecure.patch(`/admin/users/${id}/role`, { role: 'admin' })
                setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: 'admin' } : u)));
            }
        });
    };

    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-6">Manage Users — {users.length}</h2>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Name</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Role</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="text-center">{u.name}</td>
                                <td className="text-center">{u.email}</td>
                                <td className="text-center capitalize">{u.role}</td>
                                <td className="text-center">
                                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-error'} text-white`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="text-center flex flex-wrap gap-2 justify-center">
                                    <button onClick={() => handleToggleStatus(u._id)} className="btn btn-sm">
                                        {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                                    </button>
                                    {u.role !== 'admin' && (
                                        <button onClick={() => handleMakeAdmin(u._id)} className="btn btn-sm bg-lime-300">
                                            Make Admin
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
