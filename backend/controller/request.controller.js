const _ = require("lodash");
const { Request } = require("../models/request.model");
const User = require("../models/users.model");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.utils");

// @desc Create a new request
// @route POST /api/requests/
// @access Private
const createRequest = asyncHandler(async (req, res) => {
  const requestExists = await Request.findOne({
    "item._id": req.body.item._id,
    "swapItem._id": req.body.swapItem._id,
  });
  if (requestExists) {
    res.status(400);
    throw new Error("Sorry, you have already made a request");
  }

  const request = await Request.create(req.body);

  if (request) {
    const requestSender = await User.findByIdAndUpdate(
      request.swapItemStore.owner._id,
      { $push: { outgoingRequests: request } },
      { new: true }
    );

    const requestReceiver = await User.findByIdAndUpdate(
      request.itemStore.owner._id,
      { $push: { incomingRequests: request } },
      { new: true }
    );

    if (requestSender && requestReceiver) {
      const { password, ...otherKeys } = requestSender._doc;
      res
        .status(200)
        .json({ ...otherKeys, token: generateToken(requestSender._id) });
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
  const { _id, ...update } = req.body;

  const request = Request.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );

  if (request) {
    let senderSet = {};
    Object.keys(update).map((field) => {
      senderSet[`outgoingRequests.$.${field}`] = req.body[field];
    });

    const updateSender = await User.updateOne(
      {
        _id: request.swapItemStore.owner._id,
        outgoingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: senderSet },
      { new: true }
    );

    let receiverSet = {};
    Object.keys(update).map((field) => {
      receiverSet[`incomingRequests.$.${field}`] = req.body[field];
    });

    const updateReceiver = await User.updateOne(
      {
        _id: request.itemStore.owner._id,
        incomingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: receiverSet },
      { new: true }
    );

    if (updateSender && updateReceiver) {
      const { password, ...otherKeys } = updateSender._doc;
      res
        .status(200)
        .json({ ...otherKeys, token: generateToken(updateSender._id) });
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
      { _id: request.swapItemStore.owner._id },
      {
        $pull: {
          outgoingRequests: { _id: request._id },
        },
      },
      { new: true }
    );

    await User.updateOne(
      { _id: request.itemStore.owner._id },
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
        _id: request.swapItemStore.owner._id,
        outgoingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: { status: "accepted" } },
      { new: true }
    );

    const updateReceiver = await User.updateOne(
      {
        _id: request.itemStore.owner._id,
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
        _id: request.swapItemStore.owner._id,
        outgoingRequests: { $elemMatch: { _id: request._id } },
      },
      { $set: { status: "rejected" } },
      { new: true }
    );

    const updateReceiver = await User.updateOne(
      {
        _id: request.itemStore.owner._id,
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
