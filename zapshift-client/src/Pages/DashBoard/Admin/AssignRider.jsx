import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { assignParcel, getUnassignedParcels } from "../../../service/parcelService";
import { getActiveRiders } from "../../../service/riderService";

// Replace with real fetches, e.g. GET /admin/parcels?assigned=false and GET /admin/riders?status=active


const AssignRider = () => {
    const [parcels, setParcels] = useState([]);

    const [riders, setRiders] = useState([]);
    const [selectedRider, setSelectedRider] = useState({});
    useEffect(() => {

        const loadData = async () => {

            const parcelData = await getUnassignedParcels();

            const riderData = await getActiveRiders();


            setParcels(parcelData);

            setRiders(riderData);

        };


        loadData();

    }, []);
    const handleAssign = async (parcelId) => {

        const riderId = selectedRider[parcelId];


        if (!riderId) {
            Swal.fire({
                icon: "warning",
                title: "Pick a rider first"
            });
            return;
        }


        await assignParcel(
            parcelId,
            riderId
        );


        setParcels(prev =>
            prev.filter(
                p => p.parcel_id !== parcelId
            )
        );


        Swal.fire({
            icon: "success",
            title: "Rider assigned",
            timer: 1200,
            showConfirmButton: false
        });

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
                            <tr key={p.parcel_id}>
                                <td className="text-center">{p.parcel_name}</td>

                                <td className="text-center">{p.division}</td>

                                <td className="text-center">৳{p.cost}</td>

                                <td className="text-center">
                                    <select
                                        className="select select-sm"
                                        defaultValue=""
                                        onChange={(e) =>
                                            setSelectedRider((prev) => ({
                                                ...prev,
                                                [p.parcel_id]: e.target.value
                                            }))
                                        }
                                    >
                                        <option value="" disabled>
                                            Pick a rider
                                        </option>

                                        {riders.map((r) => (
                                            <option
                                                key={r.rider_id}
                                                value={r.rider_id}
                                            >
                                                {r.full_name} ({r.division})
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="text-center">
                                    <button
                                        onClick={() => handleAssign(p.parcel_id)}
                                        className="btn btn-sm bg-lime-300"
                                    >
                                        Assign
                                    </button>
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
