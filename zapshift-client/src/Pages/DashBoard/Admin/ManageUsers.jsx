import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { userService } from "../../../service/userService";




const ManageUsers = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadUsers = async () => {

            try {

                const data = await userService.getAllUsers();
                setUsers(data);

            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }

        };


        loadUsers();

    }, []);


    const handleToggleStatus = async (id, status) => {

        const newStatus =
            status === "active"
                ? "suspended"
                : "active";


        await userService.updateStatus(
            id,
            newStatus
        );


        setUsers(prev =>
            prev.map(user =>
                user._id === id
                    ? { ...user, status: newStatus }
                    : user
            )
        );

    };

    const handleMakeAdmin = async (id) => {

        const result = await Swal.fire({
            title: "Promote to admin?",
            icon: "warning",
            showCancelButton: true
        });


        if (result.isConfirmed) {

            await userService.makeAdmin(id);


            setUsers(prev =>
                prev.map(user =>
                    user._id === id
                        ? { ...user, role: "admin" }
                        : user
                )
            );

        }

    };
    if (loading) {
        return (
            <div className="text-center mt-10">
                Loading users...
            </div>
        );
    }
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
                                    <button
                                        onClick={() =>
                                            handleToggleStatus(
                                                u._id,
                                                u.status
                                            )
                                        }
                                        className="btn btn-sm"
                                    >
                                        {
                                            u.status === "active"
                                                ? "Suspend"
                                                : "Reactivate"
                                        }
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
