import React, { use } from "react";
import ServiceCard from "../ServiceCard/ServiceCard";

const servicePromise = fetch("/services.json").then((res) => res.json());

const OurServices = () => {
  const services = use(servicePromise);

  return (
    <div className="w-10/12 mx-auto bg-secondary p-8 rounded-lg my-10">
      <h1 className="text-4xl font-bold text-white text-center">Our Services</h1>
      <p className="text-white w-full lg:w-1/2 mx-auto text-center">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal
        packages to business shipments &mdash; we deliver on time, every time.
      </p>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 my-8">
        {services.map((serv) => (
          <ServiceCard key={serv.id} serv={serv} />
        ))}
      </div>
    </div>
  );
};

export default OurServices;
