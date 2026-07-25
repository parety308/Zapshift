import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";

/**
 * Fields here are intentionally limited to what the Parcel table can
 * actually store: weight, type, and source/destination region+district.
 * The schema has no columns for a parcel name or receiver contact details,
 * so those are not collected (the sender is always the logged-in user,
 * already tracked via Parcel.user_id -> User).
 */
const SendParcel = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [serviceCenters, setServiceCenters] = useState([]);
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await axiosSecure.get("/regions");
        setServiceCenters(res.data.data);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Failed to load regions",
        });
      }
    };

    fetchRegions();
  }, [axiosSecure]);
  const uniqueRegions = [
    ...new Set(serviceCenters.map((c) => c.division)),
  ];
  const senderRegion = useWatch({ control, name: "senderRegion" });
  const receiverRegion = useWatch({ control, name: "receiverRegion" });

  const districtsByRegion = (division) =>
    serviceCenters
      .filter((s) => s.division === division)
      .map((d) => d.district);

  const handleSendParcel = async (data) => {
    try {
      const payload = {
        weight: parseFloat(data.parcelWeight),
        parcelType: data.parcelType,
        senderRegion: data.senderRegion,
        senderDistrict: data.senderDistrict,
        receiverRegion: data.receiverRegion,
        receiverDistrict: data.receiverDistrict,
      };

      const res = await axiosSecure.post("/parcels", payload);
      const parcel = res.data.data;

      await Swal.fire({
        title: "Parcel Booked!",
        text: `Estimated cost: ${parcel.cost} taka. You can pay any time from My Parcels.`,
        icon: "success",
      });
      navigate("/dashboard/my-parcels");
    } catch (error) {
      const message = error?.response?.data?.message || "Could not book this parcel";
      Swal.fire({ icon: "error", title: "Booking failed", text: message });
    }
  };

  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-4xl font-bold my-10">Send A Parcel</h1>

      <form className="my-10 p-4 border" onSubmit={handleSubmit(handleSendParcel)}>
        <div className="flex gap-5 mb-4">
          <label className="label gap-2">
            <input type="radio" {...register("parcelType")} value="document" className="radio" defaultChecked />
            Document
          </label>
          <label className="label gap-2">
            <input type="radio" {...register("parcelType")} value="non-document" className="radio" />
            Non-Document
          </label>
        </div>

        <fieldset className="my-1 w-full lg:w-1/3">
          <label className="label text-black">Parcel Weight (kg)</label>
          <br />
          <input
            type="number"
            step="0.01"
            {...register("parcelWeight", { required: true, min: 0.01 })}
            placeholder="e.g. 2.5"
            className="input w-full"
          />
          {errors.parcelWeight && <p className="text-red-500">A valid weight is required</p>}
        </fieldset>

        <div className="grid lg:grid-cols-2 grid-cols-1 my-10 gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Sender Details</h1>
            <p className="text-sm text-gray-500 mb-2">Sender is your logged-in account.</p>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sender Region</legend>
              <select {...register("senderRegion", { required: true })} defaultValue="" className="select">
                <option value="" disabled>Pick a region</option>
                {uniqueRegions.map((r, i) => <option key={i} value={r}>{r}</option>)}
              </select>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sender District</legend>
              <select {...register("senderDistrict", { required: true })} defaultValue="" className="select">
                <option value="" disabled>Pick a District</option>
                {districtsByRegion(senderRegion).map((r, i) => <option key={i} value={r}>{r}</option>)}
              </select>
            </fieldset>
          </div>

          <div>
            <h1 className="text-3xl font-semibold">Receiver Details</h1>
            <p className="text-sm text-gray-500 mb-2">Where the parcel is headed.</p>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Receiver Region</legend>
              <select {...register("receiverRegion", { required: true })} defaultValue="" className="select">
                <option value="" disabled>Pick a region</option>
                {uniqueRegions.map((r, i) => <option key={i} value={r}>{r}</option>)}
              </select>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Receiver District</legend>
              <select {...register("receiverDistrict", { required: true })} defaultValue="" className="select">
                <option value="" disabled>Pick a District</option>
                {districtsByRegion(receiverRegion).map((r, i) => <option key={i} value={r}>{r}</option>)}
              </select>
            </fieldset>
          </div>
        </div>
        <input type="submit" className="btn bg-lime-300 mt-5" value="Send Parcel" />
      </form>
    </div>
  );
};

export default SendParcel;
