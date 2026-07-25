import React from 'react';

// Replace with a real fetch, e.g.
// const { data } = useQuery({ queryKey: ['rider-earnings', user?.email], queryFn: ... });
const MOCK_EARNINGS = {
    totalEarned: 4260,
    thisMonth: 980,
    deliveriesCompleted: 34,
    pendingPayout: 240,
    history: [
        { _id: 'e1', label: 'Grocery Box — Sadia Akter', date: '2026-07-21', amount: 39 },
        { _id: 'e2', label: 'Book Package — Tanvir Ahmed', date: '2026-07-20', amount: 27 },
        { _id: 'e3', label: 'Gift Box — Farhana Rahman', date: '2026-07-18', amount: 52 },
    ],
};

const StatCard = ({ label, value }) => (
    <div className="border rounded-lg p-6 shadow-sm bg-base-100">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
);

const MyEarnings = () => {
    const { totalEarned, thisMonth, deliveriesCompleted, pendingPayout, history } = MOCK_EARNINGS;

    return (
        <div className="w-11/12 mx-auto my-10">
            <h2 className="text-3xl font-bold mb-6">My Earnings</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard label="Total Earned" value={`৳${totalEarned}`} />
                <StatCard label="This Month" value={`৳${thisMonth}`} />
                <StatCard label="Deliveries Completed" value={deliveriesCompleted} />
                <StatCard label="Pending Payout" value={`৳${pendingPayout}`} />
            </div>

            <h3 className="text-xl font-semibold mb-3">Recent Payouts</h3>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Delivery</th>
                            <th className="text-center">Date</th>
                            <th className="text-center">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((h) => (
                            <tr key={h._id}>
                                <td className="text-center">{h.label}</td>
                                <td className="text-center">{h.date}</td>
                                <td className="text-center">৳{h.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyEarnings;
