const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addVehicle, getAllVehicles, deleteVehicle } = require('../controllers/vehicleController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('image'), addVehicle);

router.get('/', getAllVehicles);

router.delete('/:id', deleteVehicle);

module.exports = router;
