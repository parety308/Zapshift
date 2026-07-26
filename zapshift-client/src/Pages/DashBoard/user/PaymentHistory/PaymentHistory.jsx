import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../service/axiosInstance";


const PaymentHistory = () => {


  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/payments");
      return res.data.data;
    },
  });

  return (
    <div>
      <h2 className="text-3xl md:text-5xl text-center font-bold my-5">Payment History: {payments.length}</h2>
      <div className="overflow-x-auto my-10 w-11/12 lg:w-10/12 mx-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th className="text-center">No</th>
              <th className="text-center">Parcel</th>
              <th className="text-center">Amount</th>
              <th className="text-center">Method</th>
              <th className="text-center">Status</th>
              <th className="text-center">Transaction Id</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <th className="text-center">{index + 1}</th>
                <td className="text-center">{payment.name}</td>
                <td className="text-center">${payment.amount}</td>
                <td className="text-center">{payment.method}</td>
                <td className="text-center">{payment.status}</td>
                <td className="text-center">{payment.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
