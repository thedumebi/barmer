const express = require("express");
const {
  getRequestById,
  getSentRequests,
  getReceivedRequests,
  createRequest,
  deleteRequest,
  updateRequest,
  acceptRequest,
  rejectRequest,
} = require("../controller/request.controller");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, createRequest);
router.get("/sent", protect, getSentRequests);
router.get("/received", protect, getReceivedRequests);
router.patch("/:id/accept", protect, acceptRequest);
router.patch("/:id/reject", protect, rejectRequest);
router
  .route("/:id")
  .get(protect, getRequestById)
  .patch(protect, updateRequest)
  .delete(protect, deleteRequest);

module.exports = router;
