import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

const PaymentPage = () => {
  const axiosSecure = useAxiosSecure();
  const { parcelId } = useParams();

  const { isLoading, data: parcel } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return <span className="loading loading-bars loading-lg"></span>;
  }

  const handlePayment = async () => {
    const res = await axiosSecure.post("/payments/create-checkout-session", { parcelId });
    window.location.href = res.data.data.url;
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 my-10">
      <h1 className="text-3xl">{parcel?.senderDistrict} &rarr; {parcel?.receiverDistrict}</h1>
      <p>{parcel?.weight} kg &middot; {parcel?.cost} Tk</p>
      <button onClick={handlePayment} className="btn bg-lime-400 w-32" disabled={parcel?.paymentStatus === "paid"}>
        {parcel?.paymentStatus === "paid" ? "Already Paid" : "Pay"}
      </button>
    </div>
  );
};

export default PaymentPage;
