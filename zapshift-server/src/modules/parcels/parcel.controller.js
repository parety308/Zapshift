import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { parcelService } from "./parcel.service.js";

const create = catchAsync(async (req, res) => {
  const parcel = await parcelService.createParcel(req.user.user_id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "Parcel created",
    data: parcel,
  });
});

const listMine = catchAsync(async (req, res) => {
  const parcels = await parcelService.listParcelsForUser(req.user.user_id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Parcels fetched",
    data: parcels,
  });
});

const getOne = catchAsync(async (req, res) => {
  const parcel = await parcelService.getParcelById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Parcel fetched",
    data: parcel,
  });
});

const getAll = catchAsync(async (req, res) => {
  const parcels = await parcelService.getAllParcels();

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "All parcels fetched successfully",
    data: parcels,
  });
});

const getUnassignedParcels = catchAsync(async (req, res) => {
console.log("get assigne")
  const parcels = await parcelService.getUnassignedParcels();


  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Unassigned parcels fetched",
    data: parcels
  });

});

const assignRider = catchAsync(async (req, res) => {


  const parcel = await parcelService.assignRider(
    req.params.id,
    req.body.rider_id
  );


  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rider assigned successfully",
    data: parcel
  });


});

const remove = catchAsync(async (req, res) => {
  await parcelService.deleteParcel(req.params.id, req.user.user_id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Parcel deleted",
    data: null,
  });
});

export const parcelController = {
  create,
  listMine,
  getOne,
  getAll,
  getUnassignedParcels,
  assignRider,
  remove,
};