import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth/useAuth';
// import useAxiosSecure from '../../../hooks/useAxiosSecure/useAxiosSecure';

// Mock data so the dashboard is visible without a backend. Replace with:
// const { data: deliveries = [] } = useQuery({
//   queryKey: ['rider-pending', user?.email],
//   queryFn: async () => (await axiosSecure.get(`/riders/${user.email}/pending`)).data,
// });
const MOCK_PENDING = [
    { _id: 'p1', parcelName: 'Documents Envelope', receiverName: 'Karim Hossain', receiverAddress: 'Mirpur, Dhaka', cost: 80, pickupBy: 'Today, 4:00 PM' },
    { _id: 'p2', parcelName: 'Electronics Box', receiverName: 'Nusrat Jahan', receiverAddress: 'Agrabad, Chattogram', cost: 220, pickupBy: 'Tomorrow, 10:00 AM' },
    { _id: 'p3', parcelName: 'Clothing Parcel', receiverName: 'Rafiq Islam', receiverAddress: 'Zindabazar, Sylhet', cost: 150, pickupBy: 'Tomorrow, 2:00 PM' },
];

const PendingDeliveries = () => {
    const { user } = useAuth();
    const [deliveries, setDeliveries] = useState(MOCK_PENDING);

    const handleMarkDelivered = (id) => {
        // Hook this up to your backend, e.g.
        // axiosSecure.patch(`/parcels/${id}/deliver`, { riderEmail: user.email })
        setDeliveries((prev) => prev.filter((d) => d._id !== id));
        Swal.fire({
            icon: 'success',
            title: 'Marked as delivered',
            timer: 1200,
            showConfirmButton: false,
        });
    };

    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-1">Pending Deliveries</h2>
            <p className="text-gray-500 mb-6">Assigned to {user?.displayName || 'you'} — {deliveries.length} remaining</p>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Parcel</th>
                            <th className="text-center">Receiver</th>
                            <th className="text-center">Address</th>
                            <th className="text-center">Cost</th>
                            <th className="text-center">Pickup By</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveries.map((d) => (
                            <tr key={d._id}>
                                <td className="text-center">{d.parcelName}</td>
                                <td className="text-center">{d.receiverName}</td>
                                <td className="text-center">{d.receiverAddress}</td>
                                <td className="text-center">৳{d.cost}</td>
                                <td className="text-center">{d.pickupBy}</td>
                                <td className="text-center">
                                    <button onClick={() => handleMarkDelivered(d._id)} className="btn btn-sm bg-lime-300">
                                        Mark Delivered
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!deliveries.length && (
                            <tr><td colSpan={6} className="text-center py-6">No pending deliveries. 🎉</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingDeliveries;
