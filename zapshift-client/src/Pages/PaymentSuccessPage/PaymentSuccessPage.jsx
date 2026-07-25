import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const axiosSecure = useAxiosSecure();
  const [paymentInfo, setPaymentInfo] = useState({});
 const [loading, setLoading] = useState(!!sessionId);
  const sessionId = searchParams.get("session_id");

  const called = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    if (called.current) return;
    called.current = true;

    axiosSecure
      .patch(`/payments/payment-success?session_id=${sessionId}`)
      .then((res) => {
        setPaymentInfo({
          transactionId: res.data.data.transactionId,
          trackingId: res.data.data.trackingId,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId, axiosSecure]);
  return (
    <div className="border w-11/12 lg:w-3/4 mx-auto p-5 my-10">
      <h1 className="text-3xl font-semibold text-center my-3">Payment Successful</h1>
      {loading ? (
        <p className="text-center">Confirming your payment...</p>
      ) : (
        <>
          <p>Your Transaction Id: {paymentInfo.transactionId}</p>
          <p>Your Tracking Id: {paymentInfo.trackingId}</p>
        </>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
