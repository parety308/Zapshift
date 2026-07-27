import axiosInstance from "./axiosInstance";


export const getMyRiderProfile = async () => {
    const response = await axiosInstance.get("/riders/me");
    return response.data.data;
};

export const getAllRiders = async () => {

    const response = await axiosInstance.get("/riders");

    return response.data.data;
};

export const approveRider = async (id) => {

    const response = await axiosInstance.patch(
        `/riders/${id}/approve`
    );

    return response.data.data;
};

export const removeRider = async (id) => {

    const response = await axiosInstance.delete(
        `/riders/${id}`
    );

    return response.data.data;
};

export const getActiveRiders = async () => {

    const response = await axiosInstance.get(
        "/riders/active"
    );

    return response.data.data;
};

export const getUnassignedParcels = async () => {

    const res = await axiosInstance.get(
        "/riders/parcels/unassigned"
    );

    return res.data.data;
};

export const assignRiderToParcel = async (parcelId, riderId) => {

    const res = await axiosInstance.patch(
        `/riders/assign/${parcelId}`,
        {
            rider_id: riderId
        }
    );

    return res.data.data;
};

export const getAssignedParcels = async (riderId) => {

    const res = await axiosInstance.get(
        `/riders/assigned/${riderId}`
    );

    return res.data.data;
};

export const getMyCompletedDeliveries = async () => {
    const response = await axiosInstance.get("/riders/me/completed");
    return response.data.data;
};

export const getMyEarnings = async () => {
  const response = await axiosInstance.get("/riders/me/earnings");
  return response.data.data;
};

export const getMyPendingDeliveries = async () => {
    const response = await axiosInstance.get("/riders/me/pending");
    return response.data.data;
};

export const markDelivered = async (parcelId) => {
    const response = await axiosInstance.patch(
        `/riders/parcels/${parcelId}/deliver`
    );

    return response.data.data;
};

export const applyAsRider = async (data) => {
    const response = await axiosInstance.post(
        "/riders/apply",
        data
    );

    return response.data.data;
};