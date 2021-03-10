const _ = require("lodash");
const { Request } = require("../models/request.model");
const User = require("../models/users.model");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.utils");
const Item = require("../models/items.model");
const mongoose = require("mongoose");

// @desc Create a new request
// @route POST /api/requests/
// @access Private
const createRequest = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.body.itemId);
  const swapItem = await Item.findById(req.body.swapItemId);
  const requestExists = await Request.findOne({
    "item.name": item.name,
    "swapItem.name": swapItem.name,
  });
  if (requestExists) {
    console.log(requestExists);
    res.status(400);
    throw new Error("Sorry, you have already made a request");
  }

  const request = await Request.create({
    item: { ..._.pick(item, ["_id", "name", "image", "quantity", "store"]) },
    itemQuantity: req.body.itemQuantity,
    swapItem: {
      ..._.pick(swapItem, ["_id", "name", "image", "quantity", "store"]),
    },
    swapItemQuantity: req.body.swapItemQuantity,
    comment: req.body.comment,
  });

  if (request) {
    const requestSender = await User.findByIdAndUpdate(
      request.swapItem.store.owner._id,
      { $push: { outgoingRequests: request } },
      { new: true }
    );

    const requestReceiver = await User.findByIdAndUpdate(
      request.item.store.owner._id,
      { $push: { incomingRequests: request } },
      { new: true }
    );

    if (requestSender && requestReceiver) {
      res.status(200).json(request);
    }
  } else {
    res.status(400);
    throw new Error("Invalid request data");
  }
});

// @desc Update request
// @route PATCH /api/requests/:id
// @access Private
const updateRequest = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.body.itemId);
  const swapItem = await Item.findById(req.body.swapItemId);

  const update = {
    item: { ..._.pick(item, ["_id", "name", "image", "quantity", "store"]) },
    itemQuantity: req.body.itemQuantity,
    swapItem: {
      ..._.pick(swapItem, ["_id", "name", "image", "quantity", "store"]),
    },
    swapItemQuantity: req.body.swapItemQuantity,
    comment: req.body.comment,
  };

  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );

  if (request) {
    let senderSet = {};
    Object.keys(update).map((field) => {
      senderSet[`outgoingRequests.$.${field}`] = update[field];
    });

    const updateSender = await User.updateOne(
      {
        _id: request.swapItem.store.owner._id,
        outgoingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: senderSet },
      { new: true }
    );

    let receiverSet = {};
    Object.keys(update).map((field) => {
      receiverSet[`incomingRequests.$.${field}`] = update[field];
    });

    const updateReceiver = await User.updateOne(
      {
        _id: request.item.store.owner._id,
        incomingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: receiverSet },
      { new: true }
    );

    if (updateSender && updateReceiver) {
      res.status(200).json(request);
    }
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

// @desc Get a user sent requests
// @route GET /api/requests/sent
// @access Private
const getSentRequests = asyncHandler(async (req, res) => {
  const request = await Request.find({
    "swapItem.store.owner._id": req.user._id,
  });

  if (request) {
    res.status(200).json(request);
  } else {
    res.status(404);
    throw new Error("Requests not found");
  }
});

// @desc Get a user recived requests
// @route GET /api/requests/received
// @access Private
const getReceivedRequests = asyncHandler(async (req, res) => {
  const request = await Request.find({
    "item.store.owner._id": req.user._id,
  });

  if (request) {
    res.status(200).json(request);
  } else {
    res.status(404);
    throw new Error("Requests not found");
  }
});

// @desc Get a request
// @route GET /api/requests/:id
// @access Private
const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (request) {
    res.status(200).json(request);
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

// @desc Delete request
// @route DELETE /api/requests/:id
// @access Private
const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (request) {
    await User.updateOne(
      { _id: request.swapItem.store.owner._id },
      {
        $pull: {
          outgoingRequests: { _id: request._id },
        },
      },
      { new: true }
    );

    await User.updateOne(
      { _id: request.item.store.owner._id },
      {
        $pull: {
          incomingRequests: { _id: request._id },
        },
      },
      { new: true }
    );

    await request.remove();
    res.status(200).json({ message: "Request Deleted" });
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

// @desc Accept request
// @route PATCH /api/requests/:id/accept
// @access Private
const acceptRequest = asyncHandler(async (req, res) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { $set: { status: "accepted" } },
    { new: true }
  );

  if (request) {
    const updateSender = await User.updateOne(
      {
        _id: request.swapItem.store.owner._id,
        outgoingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: { status: "accepted" } },
      { new: true }
    );

    const updateReceiver = await User.updateOne(
      {
        _id: request.item.store.owner._id,
        incomingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: { status: "accepted" } },
      { new: true }
    );

    if (updateSender && updateReceiver) {
      const { password, ...otherKeys } = updateReceiver._doc;
      res
        .status(200)
        .json({ ...otherKeys, token: generateToken(updateReceiver._id) });
    } else {
      res.status(404);
      throw new Error("User request could not be accepted");
    }
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

// @desc Reject request
// @route PATCH /api/requests/:id/reject
// @access Private
const rejectRequest = asyncHandler(async (req, res) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { $set: { status: "rejected" } },
    { new: true }
  );

  if (request) {
    const updateSender = await User.updateOne(
      {
        _id: request.swapItem.store.owner._id,
        outgoingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: { status: "rejected" } },
      { new: true }
    );

    const updateReceiver = await User.updateOne(
      {
        _id: request.item.store.owner._id,
        incomingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: { status: "rejected" } },
      { new: true }
    );

    if (updateSender && updateReceiver) {
      const { password, ...otherKeys } = updateReceiver._doc;
      res
        .status(200)
        .json({ ...otherKeys, token: generateToken(updateReceiver._id) });
    } else {
      res.status(404);
      throw new Error("User request could not be accepted");
    }
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

module.exports = {
  createRequest,
  updateRequest,
  getSentRequests,
  getReceivedRequests,
  getRequestById,
  deleteRequest,
  acceptRequest,
  rejectRequest,
};
