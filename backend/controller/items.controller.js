const _ = require("lodash");
const Item = require("../models/items.model");
const Store = require("../models/stores.model");
const asyncHandler = require("express-async-handler");
const User = require("../models/users.model");
const generateToken = require("../utils/generateToken.utils");

// @desc Create a new Item
// @route POST /api/items/
// @access Private
const createItem = asyncHandler(async (req, res) => {
  const { name, image, quantity, storeId } = req.body;

  const [lastItem] = await Item.find().sort({ created_at: -1 });
  const store = await Store.findById(storeId);

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
  if (update.name) {
    if (
      store.items.some(
        (item) => item.name.toLowerCase() === update.name.toLowerCase()
      )
    ) {
      res.status(400);
      throw new Error("Sorry, you already have an item with that name");
    }
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
      { _id: item.store._id, items: { $elemMatch: { _id: item._id } } },
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
      req.body.userId,
      {
        $push: {
          favorites: {
            ..._.pick(item, ["_id", "id", "name", "quantity", "image"]),
          },
        },
      },
      { new: true }
    );
    if (user) {
      const { password, ...otherKeys } = user._doc;
      res.status(200).json({ ...otherKeys, token: generateToken(user._id) });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
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
      req.body.userId,
      {
        $pull: { favorites: { _id: item._id } },
      },
      { new: true }
    );
    if (user) {
      const { password, ...otherKeys } = user._doc;
      res.status(200).json({ ...otherKeys, token: generateToken(user._id) });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
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

// @desc    Get Item of the day
// @route   GET /api/items/item
// @access  Public
const getItemOfTheDay = asyncHandler(async (req, res) => {
  const items = await Item.find();
  const msPerDay = 24 * 60 * 60 * 1000; //number of milliseconds in a day
  let daysSinceEpoch = Math.floor(new Date().getTime() / msPerDay); //number of days since jan 1, 1970
  let itemIndex = daysSinceEpoch % items.length;

  res.status(200).json(items[itemIndex]);
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
  getItemOfTheDay,
};
