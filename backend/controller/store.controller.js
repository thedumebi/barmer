const _ = require("lodash");
const User = require("../models/users.model");
const Store = require("../models/stores.model");
const asyncHandler = require("express-async-handler");

// @desc Create a new Store
// @route POST /api/stores
// @access Private
const createStore = asyncHandler(async (req, res) => {
  const { name, category, description, ownerId } = req.body;

  const user = await User.findById(ownerId);
  const [lastStore] = await Store.find().sort({ created_at: -1 });

  if (user.stores.some((store) => store.name === name)) {
    res.status(400);
    throw new Error("Sorry, you already have a store with that name");
  }

  const store = await Store.create({
    id: lastStore ? lastStore.id + 1 : 1,
    name,
    category,
    description,
    owner: { ..._.pick(user, ["_id", "id", "name", "username"]) },
    created_at: Date.now(),
  });

  if (store) {
    const user = await User.updateOne(
      { _id: store.owner._id },
      {
        $push: {
          stores: {
            ..._.pick(store, [
              "_id",
              "id",
              "name",
              "category",
              "description",
              "owner",
            ]),
          },
        },
      },
      { new: true }
    );
    res.status(200).json(store);
  } else {
    res.status(400);
    throw new Error("Invalid store data");
  }
});

// @desc Get store details
// @route GET /api/stores/:id
// @access Private
const getStoreById = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (store) {
    res.status(200).json(store);
  } else {
    res.status(404);
    throw new Error("Store not found");
  }
});

// @desc Update store details
// @route PATCH /api/stores/:id
// @access Private
const updateStore = asyncHandler(async (req, res) => {
  const { _id, ownerId, ...update } = req.body;

  const user = await User.findById(ownerId);
  if (user.stores.some((store) => store.name === update.name)) {
    res.status(400);
    throw new Error("Sorry, you already have a store with that name");
  }

  const store = await Store.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );

  if (store) {
    let set = {};
    Object.keys(update).map((field) => {
      set[`stores.$.${field}`] = req.body[field];
    });

    await User.updateOne(
      { _id: store.owner._id, stores: { $elemMatch: { _id: store._id } } },
      { $set: set }
    );
    res.status(200).json(store);
  } else {
    res.status(404);
    throw new Error("Store not found");
  }
});

// @desc Get all Stores
// @route GET /api/stores/
// @access Public
const getStores = asyncHandler(async (req, res) => {
  const stores = await Store.find().sort({ created_at: -1 });
  res.status(200).json(stores);
});

// @desc    Delete Store
// @route   DELETE /api/stores/:id
// @access  Private/Admin
const deleteStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (store) {
    await User.updateOne(
      { _id: store.owner._id },
      {
        $pull: {
          stores: { _id: store._id },
        },
      },
      { new: true }
    );
    await store.remove();
    res.status(200).json({ message: "Store removed" });
  } else {
    res.status(404);
    throw new Error("Store not found");
  }
});

module.exports = {
  createStore,
  getStoreById,
  updateStore,
  getStores,
  deleteStore,
};
