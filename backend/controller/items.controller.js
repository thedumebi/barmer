const _ = require("lodash");
const Item = require("../models/items.model");
const User = require("../models/users.model");
const asyncHandler = require("express-async-handler");
const { pick } = require("lodash");

// @desc Create a new Item
// @route POST /api/items/
// @access Private
const createItem = asyncHandler(async (req, res) => {
  const { name, image, quantity, owner } = req.body;

  const [lastItem] = await Item.find().sort({ created_at: -1 });
  const user = await User.findById(owner._id);
  if (user.items.includes(name)) {
    res.status(400);
    throw new Error("Sorry, you already have an item with that name");
  }
  const item = await Item.create({
    id: lastItem ? lastItem.id + 1 : 1,
    name,
    image,
    quantity,
    owner,
  });

  if (item) {
    await User.findByIdAndUpdate(
      item.owner._id,
      {
        $push: {
          items: {
            ..._.pick(item, ["_id", "id", "name", "quantity", "image"]),
          },
        },
      },
      { new: true }
    );
    res.status(200).json(item);
  } else {
    throw new Error("Invalid item data");
  }
});

// @desc Update an Item
// @route PATCH /api/items/:id
// @access Private
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (item) {
    await User.updateOne(
      { _id: item.owner._id, items: { $elemMatch: { _id: item._id } } },
      { $set: item }
    );
    res.status(200).json(item);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc Favorite an Item
// @route POST /api/items/:id/favorite
// @access Private
const favoriteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item) {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          favorites: {
            ...pick(item, ["_id", "id", "name", "quantity", "image"]),
          },
        },
      },
      { new: true }
    );
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc Favorite an Item
// @route POST /api/items/:id/unfavorite
// @access Private
const unfavoriteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item) {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { favorites: { _id: item._id } },
      },
      { new: true }
    );
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc Add to an Item
// @route POST /api/items/:id/add
// @access Private

const addItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { $inc: { quantity: req.body.quantity } },
    { new: true }
  );

  if (item) {
    await User.updateOne(
      { _id: item.owner._id, items: { $elemMatch: { _id: item._id } } },
      { $set: item }
    );
    res.status(200).json(item);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc Remove from an Item
// @route POST /api/items/:id/remove
// @access Private
const removeItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { $inc: { quantity: -req.body.quantity } },
    { new: true }
  );

  if (item) {
    await User.updateOne(
      { _id: item.owner._id, items: { $elemMatch: { _id: item._id } } },
      { $set: item }
    );
    res.status(200).json(item);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc Get all Items
// @route GET /api/items/
// @access Public
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find().sort({ created_at: -1 });
  res.status(200).json(items);
});

// @desc Get an item
// @route GET /api/items/:id
// @access Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

module.exports = {
  createItem,
  updateItem,
  favoriteItem,
  unfavoriteItem,
  addItem,
  removeItem,
  getItems,
  getItemById,
};
