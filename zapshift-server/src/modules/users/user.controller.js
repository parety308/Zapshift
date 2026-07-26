import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { userService } from "./user.service.js";


const getMe = catchAsync(async(req,res)=>{
    const user = await userService.getUserById(
        req.user.user_id
    );

    sendResponse(res,{
        success:true,
        statusCode:HttpStatus.OK,
        message:"Profile fetched",
        data:user
    });
});


// GET ALL USERS
const getAllUsers = catchAsync(async(req,res)=>{

    const users = await userService.getAllUsers();

    sendResponse(res,{
        success:true,
        statusCode:HttpStatus.OK,
        message:"Users fetched",
        data:users
    });

});


// UPDATE STATUS
const updateStatus = catchAsync(async(req,res)=>{

    const {status}=req.body;

    const user = await userService.updateUserStatus(
        req.params.id,
        status
    );


    sendResponse(res,{
        success:true,
        statusCode:HttpStatus.OK,
        message:"Status updated",
        data:user
    });

});


// UPDATE ROLE
const updateRole = catchAsync(async(req,res)=>{

    const {role}=req.body;

    const user = await userService.updateUserRole(
        req.params.id,
        role
    );


    sendResponse(res,{
        success:true,
        statusCode:HttpStatus.OK,
        message:"Role updated",
        data:user
    });

});


const updateMe = catchAsync(async(req,res)=>{
    const user = await userService.updateUser(
        req.user.user_id,
        req.body
    );

    sendResponse(res,{
        success:true,
        statusCode:HttpStatus.OK,
        message:"Profile updated",
        data:user
    });
});


export const userController={
    getMe,
    updateMe,
    getAllUsers,
    updateStatus,
    updateRole
};