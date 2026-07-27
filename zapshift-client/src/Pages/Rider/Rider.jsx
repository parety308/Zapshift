import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { applyAsRider } from "../../service/riderService";

const Rider = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const navigate = useNavigate();
  const serviceCenters = useLoaderData();

  const uniqueRegions = [...new Set(serviceCenters.map((c) => c.region))];
  const region = useWatch({ control, name: "region" });
  const districtsByRegion = (r) => serviceCenters.filter((s) => s.region === r).map((d) => d.district);

  const onSubmit = async (data) => {
    try {

        await applyAsRider({
            vehicleType: data.vehicleType,
            division: data.region,
            district: data.district
        });

        Swal.fire({
            icon: "success",
            title: "Application Submitted",
            text: "Your rider application has been submitted."
        });

        navigate("/");

    } catch (err) {

        Swal.fire({
            icon: "error",
            title: "Application Failed",
            text:
                err.response?.data?.message ||
                "Something went wrong"
        });

    }
};

  return (
    <div className="w-10/12 mx-auto">
      <h1 className="text-4xl font-bold my-5">Be a Rider</h1>
      <p className="lg:w-1/2">
        Join our growing rider community and earn on your own schedule. Fill in your details below and our
        team will reach out with the next steps to get you on the road.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="my-10">
        <h1 className="font-bold text-xl">Tell us about yourself</h1>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 lg:w-1/2">
          <div className="w-full lg:w-1/2 my-1">
            <label className="label">Vehicle Type</label>
            <select {...register("vehicleType", { required: true })} defaultValue="" className="select w-full">
              <option value="" disabled>Choose vehicle</option>
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
            </select>
            {errors.vehicleType && <p className="text-red-500">Vehicle type is required</p>}
          </div>
          <div className="w-full lg:w-1/2 my-1">
            <label className="label">Region</label>
            <select {...register("region", { required: true })} defaultValue="" className="select w-full">
              <option value="" disabled>Pick a region</option>
              {uniqueRegions.map((r, i) => <option key={i} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 lg:w-1/2">
          <div className="w-full lg:w-1/2 my-1">
            <label className="label">District</label>
            <select {...register("district", { required: true })} defaultValue="" className="select w-full">
              <option value="" disabled>Pick a district</option>
              {districtsByRegion(region).map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="btn bg-lime-300 mt-4">Submit Application</button>
      </form>
    </div>
  );
};

export default Rider;
