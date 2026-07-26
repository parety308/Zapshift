import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getMyEarnings } from "../../../service/riderService";


const StatCard = ({ label, value }) => (
  <div className="border rounded-lg p-6 shadow-sm bg-base-100">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const MyEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const data = await getMyEarnings();
        setEarnings(data);
      } catch (error) {
        console.log(error);
        Swal.fire("Error", "Failed to load earnings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="w-11/12 mx-auto my-10">
      <h2 className="text-3xl font-bold mb-6">My Earnings</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Earned"
          value={`৳${earnings?.totalEarned || 0}`}
        />

        <StatCard
          label="This Month"
          value={`৳${earnings?.thisMonth || 0}`}
        />

        <StatCard
          label="Deliveries Completed"
          value={earnings?.deliveriesCompleted || 0}
        />

        <StatCard
          label="Pending Payout"
          value={`৳${earnings?.pendingPayout || 0}`}
        />
      </div>

      <h3 className="text-xl font-semibold mb-3">
        Recent Earnings
      </h3>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">Parcel ID</th>
              <th className="text-center">Date</th>
              <th className="text-center">Amount</th>
            </tr>
          </thead>

          <tbody>
            {earnings?.history?.map((item) => (
              <tr key={item.parcel_id}>
                <td className="text-center">{item.parcel_id}</td>
                <td className="text-center">
                  {new Date(item.delivered_at).toLocaleDateString()}
                </td>
                <td className="text-center">
                  ৳{item.amount}
                </td>
              </tr>
            ))}

            {(!earnings?.history || earnings.history.length === 0) && (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  No earnings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyEarnings;