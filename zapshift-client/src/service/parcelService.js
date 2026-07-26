import axiosInstance from "./axiosInstance";


// Get all parcels (Admin)
export const getAllParcels = async () => {
    const response = await axiosInstance.get("/parcel/all");

    return response.data;
};


// Get logged-in user's parcels
export const getMyParcels = async () => {
    const response = await axiosInstance.get("/parcel");

    return response.data;
};


// Get parcel by ID
export const getParcelById = async (id) => {
    const response = await axiosInstance.get(`/parcel/${id}`);

    return response.data;
};


// Create parcel
export const createParcel = async (parcelData) => {
    const response = await axiosInstance.post(
        "/parcel",
        parcelData
    );

    return response.data;
};


// Delete parcel
export const deleteParcel = async (id) => {
    const response = await axiosInstance.delete(
        `/parcel/${id}`
    );

    return response.data;
};


// Update parcel status (optional)
export const updateParcelStatus = async (id, status) => {
    const response = await axiosInstance.patch(
        `/parcel/${id}/status`,
        {
            status
        }
    );

    return response.data;
};

export const getUnassignedParcels = async () => {

    const response = await axiosInstance.get(
        "/parcel/unassigned"
    );

    return response.data.data;
};

export const assignParcel = async(parcelId,riderId)=>{

    const response = await axiosInstance.patch(
        `/parcel/${parcelId}/assign`,
        {
            rider_id:riderId
        }
    );

    return response.data;
};