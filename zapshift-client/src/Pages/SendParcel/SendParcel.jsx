import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure/useAxiosSecure';
import useAuth from '../../hooks/useAuth/useAuth';

const SendParcel = () => {
    const { register, handleSubmit, control } = useForm();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const serviceCenters = useLoaderData();

    const uniqueRegions = [...new Set(serviceCenters.map((c) => c.region))];
    const senderRegion = useWatch({ control, name: 'senderRegion' });
    const receiverRegion = useWatch({ control, name: 'receiverRegion' });

    const districtsByRegion = (region) =>
        serviceCenters.filter((s) => s.region === region).map((d) => d.district);

    const handleSendParcel = (data) => {
        const isSameDistrict = data.senderDistrict === data.receiverDistrict;
        const isDocument = data.parcelType === 'document';
        const parcelWeight = parseFloat(data.parcelWeight) || 0;
        let cost = 0;

        if (isDocument) {
            cost = isSameDistrict ? 60 : 80;
        } else if (parcelWeight <= 3) {
            cost = isSameDistrict ? 110 : 150;
        } else {
            const minCost = isSameDistrict ? 110 : 150;
            const extraWeight = Math.ceil(parcelWeight - 3);
            const extraCost = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;
            cost = minCost + extraCost;
        }
        data.cost = cost;

        Swal.fire({
            title: 'Agree with the Cost?',
            text: `You will be charged ${cost} taka`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, take it!',
        }).then((result) => {
            if (result.isConfirmed) {
                // POST to your backend — see the "API Integration Hints" section
                // of the setup guide for the expected request/response shape.
                axiosSecure.post('/parcels', data).catch((err) => console.log(err));

                Swal.fire({
                    title: 'Accepted!',
                    text: 'Your parcel has been taken for delivery, please pay.',
                    icon: 'success',
                });
                navigate('/dashboard/my-parcels');
            }
        });
    };

    return (
        <div className="w-11/12 mx-auto">
            <h1 className="text-4xl font-bold my-10">Send A Parcel</h1>

            <form className="my-10 p-4 border" onSubmit={handleSubmit(handleSendParcel)}>
                <div className="flex gap-5 mb-4">
                    <label className="label gap-2">
                        <input type="radio" {...register('parcelType')} value="document" className="radio" defaultChecked />
                        Document
                    </label>
                    <label className="label gap-2">
                        <input type="radio" {...register('parcelType')} value="non-document" className="radio" />
                        Non-Document
                    </label>
                </div>

                <div className="lg:flex md:flex gap-5">
                    <fieldset className="my-1 w-full lg:w-1/2">
                        <label className="label text-black">Parcel Name</label><br />
                        <input type="text" {...register('parcelName')} placeholder="Type here" className="input w-full" />
                    </fieldset>
                    <fieldset className="my-1 w-full lg:w-1/2">
                        <label className="label text-black">Parcel Weight (kg)</label><br />
                        <input type="text" {...register('parcelWeight')} placeholder="Type here" className="input w-full" />
                    </fieldset>
                </div>

                <div className="grid lg:grid-cols-2 grid-cols-1 my-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">Sender Details</h1>
                        <fieldset className="my-1 w-full lg:w-1/2">
                            <label className="label text-black">Sender Name</label><br />
                            <input type="text" {...register('senderName')} placeholder="Type here" className="input w-full" defaultValue={user?.displayName} />
                        </fieldset>
                        <fieldset className="my-1 w-full lg:w-1/2">
                            <label className="label text-black">Sender Email</label>
                            <input defaultValue={user?.email} type="email" {...register('senderEmail')} placeholder="Type here" className="input w-full" />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Sender Region</legend>
                            <select {...register('senderRegion')} defaultValue="Pick a region" className="select">
                                <option disabled>Pick a region</option>
                                {uniqueRegions.map((r, i) => <option key={i}>{r}</option>)}
                            </select>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Sender District</legend>
                            <select {...register('senderDistrict')} defaultValue="Pick a District" className="select">
                                <option disabled>Pick a District</option>
                                {districtsByRegion(senderRegion).map((r, i) => <option key={i}>{r}</option>)}
                            </select>
                        </fieldset>
                        <fieldset className="my-1 w-full lg:w-1/2">
                            <label className="label text-black">Address</label><br />
                            <input type="text" {...register('senderAddress')} placeholder="Type here" className="input w-full" />
                        </fieldset>
                        <fieldset className="my-1 w-full lg:w-1/2">
                            <label className="label text-black">Sender Phone No</label><br />
                            <input type="text" {...register('senderPhone')} placeholder="Type here" className="input w-full" />
                        </fieldset>
                    </div>

                    <div>
                        <h1 className="text-3xl font-semibold">Receiver Details</h1>
                        <fieldset className="my-1 w-full lg:w-1/2">
                            <label className="label text-black">Receiver Name</label><br />
                            <input type="text" {...register('receiverName')} placeholder="Type here" className="input w-full" />
                        </fieldset>
                        <fieldset className="my-1 w-full lg:w-1/2">
                            <label className="label text-black">Receiver Email</label>
                            <input type="email" {...register('receiverEmail')} placeholder="Type here" className="input w-full" />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Receiver Region</legend>
                            <select {...register('receiverRegion')} defaultValue="Pick a region" className="select">
                                <option disabled>Pick a region</option>
                                {uniqueRegions.map((r, i) => <option key={i}>{r}</option>)}
                            </select>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Receiver District</legend>
                            <select {...register('receiverDistrict')} defaultValue="Pick a District" className="select">
                                <option disabled>Pick a District</option>
                                {districtsByRegion(receiverRegion).map((r, i) => <option key={i}>{r}</option>)}
                            </select>
                        </fieldset>
                        <fieldset className="my-1 w-full lg:w-1/2">
                            <label className="label text-black">Address</label><br />
                            <input type="text" {...register('receiverAddress')} placeholder="Type here" className="input w-full" />
                        </fieldset>
                        <fieldset className="my-1 w-full lg:w-1/2">
                            <label className="label text-black">Receiver Phone No</label><br />
                            <input type="text" {...register('receiverPhone')} placeholder="Type here" className="input w-full" />
                        </fieldset>
                    </div>
                </div>
                <input type="submit" className="btn bg-lime-300 mt-5" value="Send Parcel" />
            </form>
        </div>
    );
};

export default SendParcel;
