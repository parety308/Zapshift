import React, { useEffect, useState } from "react";
import { getAllParcels } from "../../../service/parcelService";


const statusColor = {
    delivered: "badge-success",
    ongoing: "badge-primary",
    pending: "badge-warning",
    "in-transit": "badge-info",
    cancelled: "badge-error",
};

const AllParcels = () => {
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const loadParcels = async () => {
            try {
                const res = await getAllParcels();
                setParcels(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadParcels();
    }, []);
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-6">
                All Parcels — {parcels.length}
            </h2>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">Parcel ID</th>
                            <th className="text-center">Parcel</th>
                            <th className="text-center">Type</th>
                            <th className="text-center">Weight</th>
                            <th className="text-center">Sender</th>
                            <th className="text-center">Receiver</th>
                            <th className="text-center">Cost</th>
                            <th className="text-center">Payment</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td className="text-center">{index + 1}</td>

                                <td className="text-center">{parcel._id}</td>

                                <td className="text-center">{parcel.parcelName}</td>

                                <td className="text-center capitalize">
                                    {parcel.parcelType}
                                </td>

                                <td className="text-center">{parcel.weight} kg</td>

                                <td className="text-center">
                                    {parcel.senderDistrict}, {parcel.senderRegion}
                                </td>

                                <td className="text-center">
                                    {parcel.receiverDistrict}, {parcel.receiverRegion}
                                </td>

                                <td className="text-center">৳{parcel.cost}</td>

                                <td className="text-center">
                                    <span
                                        className={`badge ${parcel.paymentStatus === "paid"
                                                ? "badge-success"
                                                : "badge-error"
                                            } text-white`}
                                    >
                                        {parcel.paymentStatus}
                                    </span>
                                </td>

                                <td className="text-center">
                                    <span
                                        className={`badge ${statusColor[parcel.deliveryStatus] || "badge-neutral"
                                            } text-white capitalize`}
                                    >
                                        {parcel.deliveryStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan="10" className="text-center py-10">
                                    No parcels found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllParcels;