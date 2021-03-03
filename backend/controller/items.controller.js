const _ = require("lodash");
const Item = require("../models/items.model");
const Store = require("../models/stores.model");
const asyncHandler = require("express-async-handler");

// @desc Create a new Item
// @route POST /api/items/
// @access Private
const createItem = asyncHandler(async (req, res) => {
  const { name, image, quantity, shopId } = req.body;

  const [lastItem] = await Item.find().sort({ created_at: -1 });
  const store = await Store.findById(shopId);

  if (store.items.some((item) => item.name === name)) {
    res.status(400);
    throw new Error("Sorry, you already have an item with that name");
  }

  const item = await Item.create({
    id: lastItem ? lastItem.id + 1 : 1,
    name,
    image,
    quantity,
    store: { ..._.pick(store, ["_id", "id", "name", "category", "owner"]) },
  });

  if (item) {
    await Store.updateOne(
      { _id: item.store._id },
      {
        $push: {
          items: {
            ..._.pick(item, [
              "_id",
              "id",
              "name",
              "quantity",
              "image",
              "store",
            ]),
          },
        },
      },
      { new: true }
    );
    res.status(200).json(item);
  } else {
    res.status(400);
    throw new Error("Invalid item data");
  }
});

// @desc Update an Item
// @route PATCH /api/items/:id
// @access Private
const updateItem = asyncHandler(async (req, res) => {
  const { _id, storeId, ...update } = req.body;

  const store = await Store.findById(storeId);
  if (
    store.items.some(
      (item) => item.name.toLowerCase() === update.name.toLowerCase()
    )
  ) {
    res.status(400);
    throw new Error("Sorry, you already have an item with that name");
  }

  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );

  if (item) {
    let set = {};
    Object.keys(update).map((field) => {
      set[`items.$.${field}`] = req.body[field];
    });

    await Store.updateOne(
      { _id: item.owner._id, items: { $elemMatch: { _id: item._id } } },
      { $set: set }
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
            ..._.pick(item, ["_id", "id", "name", "quantity", "image"]),
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
    await Store.updateOne(
      { _id: item.store._id, items: { $elemMatch: { _id: item._id } } },
      { $inc: { "items.$.quantity": req.body.quantity } }
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
    await Store.updateOne(
      { _id: item.store._id, items: { $elemMatch: { _id: item._id } } },
      { $inc: { "items.$.quantity": -req.body.quantity } }
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

// @desc    Delete Item
// @route   DELETE /api/items/:id
// @access  Private/Admin
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    await Store.updateOne(
      { _id: item.store._id },
      {
        $pull: {
          items: { _id: item._id },
        },
      },
      { new: true }
    );
    await item.remove();
    res.status(200).json({ message: "Item deleted" });
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
  deleteItem,
};
