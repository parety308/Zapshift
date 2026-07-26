import React, { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";

const Coverage = () => {
  const position = [23.685, 90.3563];
  const serviceCenters = useLoaderData();
  const mapRef = useRef(null);

  const handleSearch = (event) => {
    event.preventDefault();
    const location = event.target.location.value;
    const district = serviceCenters.find((center) =>
      center.district.toLowerCase().includes(location.toLowerCase())
    );

    if (district && mapRef.current) {
      mapRef.current.flyTo([district.latitude, district.longitude], 11);
    }
  };

  return (
    <div className="my-15">
      <h1 className="text-4xl md:text-5xl my-10 font-bold text-center">
        We are available in {serviceCenters.length} districts
      </h1>
      <div>
        <form onSubmit={handleSearch} className="mb-2 w-11/12 md:w-1/2 mx-auto">
          <label className="input w-full">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" name="location" className="grow" placeholder="Search district" />
          </label>
        </form>
      </div>
      <div className="w-11/12 mx-auto h-[500px] md:h-[650px] border rounded-lg overflow-hidden">
        <MapContainer center={position} zoom={8} scrollWheelZoom={false} className="h-full w-full" ref={mapRef}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {serviceCenters.map((center, index) => (
            <Marker position={[center.latitude, center.longitude]} key={index}>
              <Popup>
                <strong>{center.district}</strong> <br />
                Service Area: {center.covered_area.join(", ")}.
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
