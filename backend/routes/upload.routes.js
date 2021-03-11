const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const jimp = require("jimp");
const Item = require("../models/items.model");
const { protect } = require("../middleware/auth.middleware");
const asyncHandler = require("express-async-handler");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!!!", false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.end(err.toString());
      } else if (err) {
        return res.end(err.toString());
      } else {
        if (req.body.itemId) {
          const item = await Item.findById(req.body.itemId);
          if (item.image !== "") {
            try {
              fs.unlinkSync(item.image);
            } catch (error) {
              console.log(error);
            }
          }
        }

        console.log(req.file.path);
        res.send(`${req.file.path}`);
      }
    });
  })
);

module.exports = router;
