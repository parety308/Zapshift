import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { riderService } from "./rider.service.js";

const apply = catchAsync(async (req, res) => {

    const result = await riderService.applyAsRider(
        req.user.user_id,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Application submitted successfully",
        data: result,
    });

});

const getMine = catchAsync(async (req, res) => {

    const result = await riderService.getRiderByUserId(
        req.user.user_id
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Rider profile",
        data:result
    });

});

const list = catchAsync(async(req,res)=>{

    const result = await riderService.listRiders();

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"All riders",
        data:result
    });

});

const activeList = catchAsync(async(req,res)=>{

    const result = await riderService.activeRiders();

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Active riders",
        data:result
    });

});

const approve = catchAsync(async(req,res)=>{

    const result = await riderService.approveRider(
        req.params.id
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Rider approved",
        data:result
    });

});

const remove = catchAsync(async(req,res)=>{

    await riderService.removeRider(req.params.id);

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Rider removed"
    });

});

const unassignedParcels = catchAsync(async(req,res)=>{

    const result = await riderService.getUnassignedParcels();

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Unassigned parcels",
        data:result
    });

});

const assign = catchAsync(async(req,res)=>{

    const result = await riderService.assignRider(
        req.params.parcelId,
        req.body.rider_id
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Parcel assigned",
        data:result
    });

});

const assigned = catchAsync(async(req,res)=>{

    const result = await riderService.getAssignedParcels(
        req.params.riderId
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Assigned parcels",
        data:result
    });

});

const pendingDeliveries = catchAsync(async(req,res)=>{

    const result = await riderService.getPendingDeliveries(
        req.user.user_id
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Pending deliveries",
        data:result
    });

});

const deliverParcel = catchAsync(async(req,res)=>{

    const result = await riderService.markDelivered(
        req.params.parcelId
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Parcel delivered",
        data:result
    });

});

const completedDeliveries = catchAsync(async(req,res)=>{

    const result = await riderService.getCompletedDeliveries(
        req.user.user_id
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Completed deliveries",
        data:result
    });

});

const myEarnings = catchAsync(async(req,res)=>{

    const result = await riderService.getMyEarnings(
        req.user.user_id
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"My earnings",
        data:result
    });

});

export const riderController = {

    apply,
    getMine,

    list,
    activeList,
    approve,
    remove,

    unassignedParcels,
    assign,
    assigned,

    pendingDeliveries,
    deliverParcel,
    completedDeliveries,
    myEarnings

};