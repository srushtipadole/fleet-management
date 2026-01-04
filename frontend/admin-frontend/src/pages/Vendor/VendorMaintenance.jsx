import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";

export default function VendorMaintenance() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const me = await API.get("/auth/me");
        const vendorId = me.data.user.vendor?._id;

        if (!vendorId) {
          console.log("Vendor ID not found");
          return;
        }

        const res = await API.get(`/vendors/${vendorId}/jobs`);
        setJobs(res.data.jobs);
      } catch (err) {
        console.log("Failed loading jobs", err);
      }
    })();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/maintenance/${id}`, { status });

    setJobs((prev) =>
      prev.map((job) =>
        job._id === id ? { ...job, status } : job
      )
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Maintenance Jobs</h1>

      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0f2437] text-left">
              <th className="p-3 w-1/4">Vehicle</th>
              <th className="p-3 w-1/3">Description</th>
              <th className="p-3 w-1/6">Status</th>
              <th className="p-3 w-1/6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-b border-slate-700 hover:bg-[#112b44]">
                <td className="p-3">
                  <div className="font-semibold">{job.vehicle?.name}</div>
                  <div className="text-sm text-slate-400">{job.vehicle?.registrationNumber}</div>
                </td>

                <td className="p-3">{job.description}</td>

                <td className="p-3 capitalize">{job.status}</td>

                <td className="p-3">
                  <select
                    className="bg-[#1a344b] p-2 rounded border border-slate-600 outline-none"
                    value={job.status}
                    onChange={(e) => updateStatus(job._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
