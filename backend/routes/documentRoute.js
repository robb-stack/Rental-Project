const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const multer = require("multer");
const path = require("path");

// Multer setup for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  documentController.uploadDocuments
);

router.get("/my/:userId", documentController.getMyDocuments);
router.get("/pending", documentController.getPendingDocuments);
router.patch("/review", documentController.reviewDocument);

module.exports = router;