import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";

export default function VendorDashboard() {
  const [summary, setSummary] = useState({
    pending: 0,
    completed: 0,
    earnings: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/vendors/summary/me");
        setSummary(res.data);
        console.log("SUMMARY API:", res.data);

      } catch (err) {
        console.log("Failed to load dashboard");
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Vendor Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Pending Jobs" value={summary.pending} />
        <Card title="Completed Jobs" value={summary.completed} />
        <Card title="Earnings" value={`₹${summary.earnings}`} />
      </div>

      <div className="mt-6">
        <Card>
          <h2 className="text-xl font-semibold mb-3">Welcome Vendor</h2>
          <p className="text-slate-300">
            Manage your maintenance tasks, payments and notifications.
          </p>
        </Card>
      </div>
    </div>
  );
}
