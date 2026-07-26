import axiosInstance from "./axiosInstance";


const getAllUsers = async () => {

    const response = await axiosInstance.get("/users");

    return response.data.data;
};



const updateStatus = async (id, status) => {

    const response = await axiosInstance.patch(
        `/users/${id}/status`,
        {
            status
        }
    );

    return response.data.data;
};



const makeAdmin = async (id) => {

    const response = await axiosInstance.patch(
        `/users/${id}/role`,
        {
            role: "admin"
        }
    );

    return response.data.data;
};



export const userService = {
    getAllUsers,
    updateStatus,
    makeAdmin
};