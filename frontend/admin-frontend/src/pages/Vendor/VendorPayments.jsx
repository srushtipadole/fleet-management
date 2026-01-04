import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";

export default function VendorPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const me = await API.get("/auth/me");

        // vendor is an object → extract ID
        const vendorId = me.data.user.vendor?._id;

        if (!vendorId) {
          console.log("Vendor ID missing");
          return;
        }

        const res = await API.get(`/payments/vendor/${vendorId}`);
        setPayments(res.data.payments);
      } catch (err) {
        console.log("Payment load failed", err);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Payments</h1>

      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0f2437] text-left">
              <th className="p-3 w-1/6">Amount</th>
              <th className="p-3 w-1/3">Job</th>
              <th className="p-3 w-1/6">Status</th>
              <th className="p-3 w-1/6">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b border-slate-700 hover:bg-[#112b44]">
                
                {/* Amount */}
                <td className="p-3 font-semibold text-green-400">
                  ₹{p.amount}
                </td>

                {/* Job ID or Job Name */}
                <td className="p-3">
                  {p.job?._id || p.job}
                </td>

                {/* Status Badge */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      p.status === "paid"
                        ? "bg-green-600 text-white"
                        : p.status === "pending"
                        ? "bg-yellow-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                {/* Date */}
                <td className="p-3 text-slate-300">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </Card>
    </div>
  );
}
