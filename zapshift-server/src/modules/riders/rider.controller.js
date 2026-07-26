import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { riderService } from "./rider.service.js";

const apply = catchAsync(async (req, res) => {
  const rider = await riderService.applyAsRider(req.user.user_id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "Rider application submitted",
    data: rider,
  });
});

const getMine = catchAsync(async (req, res) => {
  const rider = await riderService.getRiderByUserId(req.user.user_id);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: rider ? "Rider profile fetched" : "No rider application on file",
    data: rider,
  });
});

const list = catchAsync(async (req, res) => {
  const riders = await riderService.listRiders();
  sendResponse(res, { success: true, statusCode: HttpStatus.OK, message: "Riders fetched", data: riders });
});

const activeList = catchAsync(async(req,res)=>{

  const riders = await riderService.activeRiders();


  sendResponse(res,{
    success:true,
    statusCode:HttpStatus.OK,
    message:"Active riders fetched",
    data:riders
  });

});

const approve = catchAsync(async (req, res) => {

  const rider = await riderService.approveRider(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rider approved",
    data: rider
  });

});


const remove = catchAsync(async (req, res) => {

  await riderService.removeRider(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rider removed"
  });

});

const unassignedParcels = catchAsync(async (req, res) => {

  const data = await riderService.getUnassignedParcels();

  sendResponse(res,{
    success:true,
    statusCode:200,
    message:"Unassigned parcels fetched",
    data
  });

});
const assign = catchAsync(async(req,res)=>{

    const parcel = await riderService.assignRider(
        req.params.parcelId,
        req.body.rider_id
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Rider assigned successfully",
        data:parcel
    });

});
const assigned = catchAsync(async(req,res)=>{

    const data = await riderService.getAssignedParcels(
        req.params.riderId
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Assigned parcels",
        data
    });

});

const pendingDeliveries = catchAsync(async (req, res) => {

  const data = await riderService.getPendingDeliveries(
    req.user.user_id
  );

  sendResponse(res,{
    success:true,
    statusCode:200,
    message:"Pending deliveries",
    data
  });

});

const deliverParcel = catchAsync(async(req,res)=>{

    const data = await riderService.markDelivered(
        req.params.parcelId
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Parcel delivered",
        data
    });

});
const completedDeliveries = catchAsync(async(req,res)=>{

    const data = await riderService.getCompletedDeliveries(
        req.user.user_id
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Completed deliveries",
        data
    });

});

const myEarnings = catchAsync(async(req,res)=>{

    const data = await riderService.getMyEarnings(
        req.user.user_id
    );

    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"My earnings",
        data
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
