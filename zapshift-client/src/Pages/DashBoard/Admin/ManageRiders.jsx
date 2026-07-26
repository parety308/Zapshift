import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { approveRider, getAllRiders, removeRider } from "../../../service/riderService";

const ManageRiders = () => {
const [riders, setRiders] = useState([]);
const [loading, setLoading] = useState(true);


const loadRiders = async () => {

    try {

        setLoading(true);

        const data = await getAllRiders();

        setRiders(data);

    } catch (error) {

        console.log(error);

        Swal.fire(
            "Error",
            "Failed to load riders",
            "error"
        );

    } finally {

        setLoading(false);

    }

};



useEffect(() => {

    const fetchRiders = async () => {

        try {

            setLoading(true);

            const data = await getAllRiders();

            setRiders(data);

        } catch (error) {

            console.log(error);

            Swal.fire(
                "Error",
                "Failed to load riders",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };


    fetchRiders();

}, []);



const handleApprove = async (id) => {

    try {

        await approveRider(id);


        Swal.fire({
            title: "Approved!",
            text: "Rider has been approved",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });


        await loadRiders();


    } catch (error) {

        console.log(error);

    }

};



const handleRemove = async (id) => {


    const result = await Swal.fire({

        title: "Remove Rider?",

        text: "This action cannot be undone",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#ef4444",

        cancelButtonColor: "#6b7280",

        confirmButtonText: "Yes, remove"

    });



    if (result.isConfirmed) {


        try {

            await removeRider(id);


            Swal.fire({

                title: "Removed!",

                text: "Rider removed successfully",

                icon: "success",

                timer: 1200,

                showConfirmButton: false

            });


            await loadRiders();


        } catch(error) {

            console.log(error);

        }

    }

};



if (loading) {

    return (

        <div className="flex justify-center items-center h-96">

            <span className="loading loading-spinner loading-lg text-primary"></span>

        </div>

    );

}
    return (

        <div className="w-11/12 mx-auto my-10">

            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8">

                <h1 className="text-4xl font-bold">
                    Manage Riders
                </h1>

                <p className="mt-2 opacity-90">
                    Review, approve and manage all delivery riders
                </p>


                <div className="mt-5 bg-white/20 rounded-xl px-5 py-3 inline-block">
                    <span className="text-2xl font-bold">
                        {riders.length}
                    </span>
                    <span className="ml-2">
                        Total Riders
                    </span>
                </div>

            </div>



            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">


                <table className="w-full">

                    <thead>

                        <tr className="border-b text-gray-600">

                            <th className="p-4 text-left">
                                Rider
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                Location
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-center">
                                Action
                            </th>

                        </tr>

                    </thead>



                    <tbody>

                        {
                            riders.map((rider) => (

                                <tr
                                    key={rider.rider_id}
                                    className="border-b hover:bg-gray-50 transition"
                                >


                                    <td className="p-4">

                                        <div className="flex items-center gap-3">

                                            <div className="avatar placeholder">

                                                <div className="bg-blue-500 text-white rounded-full w-12">
                                                    <span>
                                                        {rider.full_name?.charAt(0)}
                                                    </span>
                                                </div>

                                            </div>


                                            <div>

                                                <p className="font-semibold">
                                                    {rider.full_name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Rider ID: {rider.rider_id}
                                                </p>

                                            </div>

                                        </div>

                                    </td>



                                    <td className="p-4 text-gray-600">
                                        {rider.email}
                                    </td>



                                    <td className="p-4">

                                        <span className="font-medium">
                                            {rider.division}
                                        </span>

                                        <br />

                                        <span className="text-sm text-gray-500">
                                            {rider.district}
                                        </span>

                                    </td>




                                    <td className="p-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold
                                            ${
                                                rider.availability_status === "approved"
                                                ?
                                                "bg-green-100 text-green-700"
                                                :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >

                                            {rider.availability_status}

                                        </span>

                                    </td>




                                    <td className="p-4 text-center">

                                        <button
                                            onClick={() => handleApprove(rider.rider_id)}
                                            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                                        >
                                            Approve
                                        </button>


                                        <button
                                            onClick={() => handleRemove(rider.rider_id)}
                                            className="px-4 py-2 rounded-lg bg-red-500 text-white ml-3 hover:bg-red-600 transition"
                                        >
                                            Remove
                                        </button>


                                    </td>


                                </tr>

                            ))
                        }


                    </tbody>


                </table>



                {
                    riders.length === 0 && (

                        <div className="text-center py-10 text-gray-500">
                            No riders found
                        </div>

                    )
                }


            </div>


        </div>

    );
};


export default ManageRiders;