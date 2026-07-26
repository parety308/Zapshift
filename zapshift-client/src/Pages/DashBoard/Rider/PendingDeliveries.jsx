import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth/useAuth";
import { getMyPendingDeliveries, markDelivered } from "../../../service/riderService";


const PendingDeliveries = () => {
  const { user } = useAuth();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);

        const data = await getMyPendingDeliveries();
        setDeliveries(data);

      } catch (error) {
        console.log(error);

        Swal.fire(
          "Error",
          "Failed to load deliveries",
          "error"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);


  const handleMarkDelivered = async (parcelId) => {
    try {
      await markDelivered(parcelId);

      Swal.fire({
        icon: "success",
        title: "Delivery Completed",
        timer: 1200,
        showConfirmButton: false,
      });

      // reload after update
      const data = await getMyPendingDeliveries();
      setDeliveries(data);

    } catch (error) {
      console.log(error);

      Swal.fire(
        "Error",
        "Could not mark delivery.",
        "error"
      );
    }
  };


  if (loading) {
    return (
      <div className="text-center py-10">
        Loading...
      </div>
    );
  }



  return (
    <div className="w-11/12 mx-auto my-10">
      <h2 className="text-3xl font-bold mb-1">Pending Deliveries</h2>

      <p className="text-gray-500 mb-6">
        Assigned to {user?.displayName || user?.email} — {deliveries.length} remaining
      </p>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">Parcel ID</th>
              <th className="text-center">Sender</th>
              <th className="text-center">Type</th>
              <th className="text-center">Weight</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {deliveries.map((parcel) => (
              <tr key={parcel.parcel_id}>
                <td className="text-center">{parcel.parcel_id}</td>
                <td className="text-center">{parcel.full_name}</td>
                <td className="text-center">{parcel.parcel_type}</td>
                <td className="text-center">{parcel.weight} kg</td>
                <td className="text-center">{parcel.parcel_status}</td>

                <td className="text-center">
                  <button
                    onClick={() => handleMarkDelivered(parcel.parcel_id)}
                    className="btn btn-sm btn-success"
                  >
                    Mark Delivered
                  </button>
                </td>
              </tr>
            ))}

            {!deliveries.length && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No pending deliveries 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingDeliveries;