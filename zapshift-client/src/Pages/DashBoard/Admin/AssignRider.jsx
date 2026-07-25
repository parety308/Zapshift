import React, { useState } from 'react';
import Swal from 'sweetalert2';

// Replace with real fetches, e.g. GET /admin/parcels?assigned=false and GET /admin/riders?status=active
const MOCK_UNASSIGNED_PARCELS = [
    { _id: 'p10', parcelName: 'Furniture Part', region: 'Dhaka', cost: 300 },
    { _id: 'p11', parcelName: 'Medicine Box', region: 'Khulna', cost: 120 },
];
const MOCK_ACTIVE_RIDERS = [
    { _id: 'r2', name: 'Shakil Rana', region: 'Chattogram' },
    { _id: 'r3', name: 'Imran Kabir', region: 'Sylhet' },
    { _id: 'r4', name: 'Momtaz Uddin', region: 'Dhaka' },
];

const AssignRider = () => {
    const [parcels, setParcels] = useState(MOCK_UNASSIGNED_PARCELS);
    const [selectedRider, setSelectedRider] = useState({});

    const handleAssign = (parcelId) => {
        const riderId = selectedRider[parcelId];
        if (!riderId) {
            Swal.fire({ icon: 'warning', title: 'Pick a rider first', timer: 1200, showConfirmButton: false });
            return;
        }
        // Hook this up to your backend, e.g.
        // axiosSecure.patch(`/admin/parcels/${parcelId}/assign`, { riderId })
        setParcels((prev) => prev.filter((p) => p._id !== parcelId));
        Swal.fire({ icon: 'success', title: 'Rider assigned', timer: 1200, showConfirmButton: false });
    };

    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-1">Assign Rider</h2>
            <p className="text-gray-500 mb-6">{parcels.length} unassigned parcels</p>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Parcel</th>
                            <th className="text-center">Region</th>
                            <th className="text-center">Cost</th>
                            <th className="text-center">Rider</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map((p) => (
                            <tr key={p._id}>
                                <td className="text-center">{p.parcelName}</td>
                                <td className="text-center">{p.region}</td>
                                <td className="text-center">৳{p.cost}</td>
                                <td className="text-center">
                                    <select
                                        className="select select-sm"
                                        defaultValue=""
                                        onChange={(e) =>
                                            setSelectedRider((prev) => ({ ...prev, [p._id]: e.target.value }))
                                        }
                                    >
                                        <option value="" disabled>Pick a rider</option>
                                        {MOCK_ACTIVE_RIDERS.map((r) => (
                                            <option key={r._id} value={r._id}>{r.name} ({r.region})</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="text-center">
                                    <button onClick={() => handleAssign(p._id)} className="btn btn-sm bg-lime-300">Assign</button>
                                </td>
                            </tr>
                        ))}
                        {!parcels.length && (
                            <tr><td colSpan={5} className="text-center py-6">All parcels are assigned. 🎉</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignRider;
