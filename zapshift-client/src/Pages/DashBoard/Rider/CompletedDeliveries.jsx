import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getMyCompletedDeliveries } from "../../../service/riderService";


const CompletedDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCompleted = async () => {
            try {
                const data = await getMyCompletedDeliveries();
                setDeliveries(data);
            } catch (error) {
                console.log(error);
                Swal.fire("Error", "Failed to load completed deliveries", "error");
            } finally {
                setLoading(false);
            }
        };

        loadCompleted();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-1">
                Completed Deliveries
            </h2>

            <p className="text-gray-500 mb-6">
                {deliveries.length} completed
            </p>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th className="text-center">Parcel ID</th>
                            <th className="text-center">Sender</th>
                            <th className="text-center">Type</th>
                            <th className="text-center">Weight</th>
                            <th className="text-center">Delivered On</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {deliveries.map((parcel) => (
                            <tr key={parcel.parcel_id}>
                                <td className="text-center">{parcel.parcel_id}</td>
                                <td className="text-center">{parcel.full_name}</td>
                                <td className="text-center">{parcel.parcel_type}</td>
                                <td className="text-center">{parcel.weight} kg</td>
                                <td className="text-center">
                                    {new Date(parcel.delivered_at).toLocaleDateString()}
                                </td>
                                <td className="text-center">
                                    <span className="badge badge-success text-white">
                                        Delivered
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {!deliveries.length && (
                            <tr>
                                <td colSpan={6} className="text-center py-6">
                                    No completed deliveries.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompletedDeliveries;