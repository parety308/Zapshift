import React from 'react';

// Replace with a real fetch, e.g.
// const { data: deliveries = [] } = useQuery({
//   queryKey: ['rider-completed', user?.email],
//   queryFn: async () => (await axiosSecure.get(`/riders/${user.email}/completed`)).data,
// });
const MOCK_COMPLETED = [
    { _id: 'c1', parcelName: 'Grocery Box', receiverName: 'Sadia Akter', deliveredAt: '2026-07-21', cost: 130 },
    { _id: 'c2', parcelName: 'Book Package', receiverName: 'Tanvir Ahmed', deliveredAt: '2026-07-20', cost: 90 },
    { _id: 'c3', parcelName: 'Gift Box', receiverName: 'Farhana Rahman', deliveredAt: '2026-07-18', cost: 175 },
];

const CompletedDeliveries = () => {
    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-1">Completed Deliveries</h2>
            <p className="text-gray-500 mb-6">{MOCK_COMPLETED.length} completed</p>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th className="text-center">Parcel</th>
                            <th className="text-center">Receiver</th>
                            <th className="text-center">Delivered On</th>
                            <th className="text-center">Cost</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_COMPLETED.map((d) => (
                            <tr key={d._id}>
                                <td className="text-center">{d.parcelName}</td>
                                <td className="text-center">{d.receiverName}</td>
                                <td className="text-center">{d.deliveredAt}</td>
                                <td className="text-center">৳{d.cost}</td>
                                <td className="text-center">
                                    <span className="badge badge-success text-white">Delivered</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompletedDeliveries;
