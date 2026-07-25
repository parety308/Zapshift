import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const Myparcels = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: parcels = [], isLoading, refetch } = useQuery({
    queryKey: ["my-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data.data;
    },
  });

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/parcels/${id}`)
          .then(() => {
            refetch();
            Swal.fire({ title: "Deleted!", text: "Your parcel has been deleted.", icon: "success" });
          })
          .catch((err) => {
            const message = err?.response?.data?.message || "Could not delete this parcel";
            Swal.fire({ title: "Error", text: message, icon: "error" });
          });
      }
    });
  };

  const handlePayment = async (parcel) => {
    try {
      const res = await axiosSecure.post("/payments/create-checkout-session", { parcelId: parcel._id });
      window.location.assign(res.data.data.url);
    } catch (error) {
      const message = error?.response?.data?.message || "Could not start checkout";
      Swal.fire({ title: "Error", text: message, icon: "error" });
    }
  };

  return (
    <div>
      <h2 className="text-3xl text-center font-semibold">All of my parcels: {parcels.length}</h2>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-11/12 lg:w-10/12 mx-auto my-6">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center text-black">No</th>
              <th className="text-center text-black">Route</th>
              <th className="text-center text-black">Weight</th>
              <th className="text-center text-black">Total Cost</th>
              <th className="text-center text-black">Payment Status</th>
              <th className="text-center text-black">Delivery Status</th>
              <th className="text-center text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No parcels yet. Send your first parcel to see it here.
                </td>
              </tr>
            )}
            {parcels.map((p, index) => (
              <tr key={p._id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{p.senderDistrict} &rarr; {p.receiverDistrict}</td>
                <td className="text-center">{p.weight} kg</td>
                <td className="text-center">{p.cost} Tk</td>
                <td className="text-center">
                  {p.paymentStatus === "paid" ? (
                    <span className="btn bg-blue-100">Paid</span>
                  ) : (
                    <button onClick={() => handlePayment(p)} className="btn bg-lime-400">Pay</button>
                  )}
                </td>
                <td className="text-center">
                  {p.deliveryStatus === "delivered" ? (
                    <span className="text-yellow-400 btn btn-outline">Delivered</span>
                  ) : (
                    <span className="text-blue-400 btn btn-outline">Ongoing</span>
                  )}
                </td>
                <td className="text-center">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-square mr-1 hover:bg-lime-300"
                    disabled={p.paymentStatus === "paid"}
                    title={p.paymentStatus === "paid" ? "Paid parcels cannot be deleted" : "Delete"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Myparcels;
