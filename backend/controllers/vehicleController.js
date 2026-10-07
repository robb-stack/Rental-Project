const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const adjustVehiclePrices = require('../utils/priceAdjusters');

exports.getAllVehicles = async (req, res) => {
  const userId = parseInt(req.query.userId);

  try {
    await adjustVehiclePrices();

    const vehicles = await prisma.vehicle.findMany();
    const baseImageUrl = `${req.protocol}://${req.get('host')}/uploads/`;

    const vehiclesWithImageUrl = vehicles.map(vehicle => ({
      ...vehicle,
      imageUrl: vehicle.image ? baseImageUrl + vehicle.image : null,
    }));

    if (!isNaN(userId)) {
      await prisma.userActivity.create({
        data: {
          userId,
          accessedAt: new Date(),
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: vehiclesWithImageUrl,
    });
  } catch (error) {
    console.error('getAllVehicles error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: error.message,
    });
  }
};


exports.addVehicle = async (req, res) => {
  try {
    const { name, price, status } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        rate: parseFloat(price),
        status,
        image,
      },
    });

    res.status(201).json({ message: "Vehicle added", vehicle });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.deleteVehicle = async (req, res) => {
  const id = parseInt(req.params.id);
  const vehicleId = parseInt(id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid vehicle ID" });
  }

  try {
    await prisma.booking.deleteMany({ where: { vehicleId } });

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await prisma.vehicle.delete({ where: { id } });

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const logUserActivity = async (userId) => {
  try {
    await prisma.userActivity.create({
      data: {
        userId,
      },
    });
  } catch (error) {
    console.error('Failed to log user activity:', error.message);
  }
};
