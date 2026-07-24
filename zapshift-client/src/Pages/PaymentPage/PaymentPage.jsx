import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure/useAxiosSecure';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

const PaymentPage = () => {
    const axiosSecure = useAxiosSecure();
    const { parcelId } = useParams();

    const { isLoading, data: parcel } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        },
    });

    if (isLoading) {
        return <span className="loading loading-bars loading-lg"></span>;
    }

    const handlePayment = async () => {
        const paymentInfo = {
            cost: parcel.cost,
            parcelId: parcel._id,
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName,
        };

        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        window.location.href = res.data.url;
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 my-10">
            <h1 className="text-4xl">{parcel?.parcelName}</h1>
            <button onClick={handlePayment} className="btn bg-lime-400 w-20">Pay</button>
        </div>
    );
};

export default PaymentPage;
