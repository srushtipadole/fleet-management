import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LiveMap({ vehicles = [], style = { height: 400 } }) {
  // Default center (Mumbai) — if no vehicles available
  const defaultCenter = {
    lat: 19.2183,
    lng: 72.9781,
  };

  // Filter only vehicles that have valid coordinates
  const validVehicles = vehicles.filter(
    (v) => v?.location?.lat && v?.location?.lng
  );

  return (
    <MapContainer
      center={
        validVehicles.length
          ? [validVehicles[0].location.lat, validVehicles[0].location.lng]
          : [defaultCenter.lat, defaultCenter.lng]
      }
      zoom={12}
      style={style}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {validVehicles.map((v, i) => (
        <Marker
          key={v._id || i}
          position={[v.location.lat, v.location.lng]}
        >
          <Popup>
            <strong>{v.name || "Vehicle"}</strong>
            <br />
            Speed: {v.speed ?? "N/A"} km/h
            <br />
            Fuel: {v.fuelLevel ?? "N/A"}%
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
