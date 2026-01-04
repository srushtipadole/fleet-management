import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";

export default function VendorProfile() {
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await API.get("/auth/me");
                // vendor is object → extract _id
        const vendorId = me.data.user.vendor?._id;

        if (!vendorId) {
          console.log("Vendor ID missing");
          return;
        }


        const res = await API.get(`/vendors/${vendorId}`);
        setVendor(res.data.vendor);
      } catch {
        console.log("Profile load error");
      }
    })();
  }, []);

  if (!vendor) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Vendor Profile</h1>

      <Card>
        <div className="space-y-2">
          <p><strong>Name:</strong> {vendor.name}</p>
          <p><strong>Email:</strong> {vendor.email}</p>
          <p><strong>Phone:</strong> {vendor.phone}</p>
          <p><strong>Address:</strong> {vendor.address}</p>
          <p><strong>Services:</strong> {vendor.services.join(", ")}</p>
        </div>
      </Card>
    </div>
  );
}
