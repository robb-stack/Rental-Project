const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

// Helper to check if both documents are approved
const checkAndUpdateVerified = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const isVerified =
    user.nationalIdStatus === "approved" &&
    user.drivingLicenseStatus === "approved";

  if (user.documentsVerified !== isVerified) {
    await prisma.user.update({
      where: { id: userId },
      data: { documentsVerified: isVerified },
    });
  }

  return isVerified;
};

// Upload documents (National ID or Driving License)
exports.uploadDocuments = async (req, res) => {
  try {
    const userId = parseInt(req.body.userId);
    const type = req.body.type; // "nationalId" or "drivingLicense"

    if (!userId || !type) {
      return res.status(400).json({ status: "error", message: "userId and type are required" });
    }

    if (!["nationalId", "drivingLicense"].includes(type)) {
      return res.status(400).json({ status: "error", message: "Invalid type" });
    }

    const updateData = {};

    if (type === "nationalId") {
      if (req.files?.front) updateData.nationalIdFront = `/uploads/${req.files.front[0].filename}`;
      if (req.files?.back) updateData.nationalIdBack = `/uploads/${req.files.back[0].filename}`;
      updateData.nationalIdStatus = "pending";
      updateData.nationalIdRejection = null;
    }

    if (type === "drivingLicense") {
      if (req.files?.front) updateData.drivingLicenseFront = `/uploads/${req.files.front[0].filename}`;
      if (req.files?.back) updateData.drivingLicenseBack = `/uploads/${req.files.back[0].filename}`;
      if (req.body.licenseExpiry) updateData.licenseExpiry = new Date(req.body.licenseExpiry);
      updateData.drivingLicenseStatus = "pending";
      updateData.drivingLicenseRejection = null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await checkAndUpdateVerified(userId);

    res.json({
      status: "success",
      message: `${type} uploaded successfully. Waiting for admin approval.`,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get my documents status (for client)
exports.getMyDocuments = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        nationalIdFront: true,
        nationalIdBack: true,
        nationalIdStatus: true,
        nationalIdRejection: true,
        drivingLicenseFront: true,
        drivingLicenseBack: true,
        drivingLicenseStatus: true,
        drivingLicenseRejection: true,
        licenseExpiry: true,
        documentsVerified: true,
      },
    });

    res.json({ status: "success", data: user });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Admin: Get all users with pending documents
exports.getPendingDocuments = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { nationalIdStatus: "pending" },
          { drivingLicenseStatus: "pending" },
        ],
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        nationalIdFront: true,
        nationalIdBack: true,
        nationalIdStatus: true,
        drivingLicenseFront: true,
        drivingLicenseBack: true,
        drivingLicenseStatus: true,
        licenseExpiry: true,
      },
    });

    res.json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Admin: Approve / Reject document
exports.reviewDocument = async (req, res) => {
  try {
    const { userId, type, action, reason } = req.body; // type: nationalId | drivingLicense, action: approved | rejected

    if (!userId || !type || !action) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    const updateData = {};

    if (type === "nationalId") {
      updateData.nationalIdStatus = action;
      updateData.nationalIdRejection = action === "rejected" ? reason || "Rejected by admin" : null;
    }

    if (type === "drivingLicense") {
      updateData.drivingLicenseStatus = action;
      updateData.drivingLicenseRejection = action === "rejected" ? reason || "Rejected by admin" : null;
    }

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
    });

    const verified = await checkAndUpdateVerified(parseInt(userId));

    res.json({
      status: "success",
      message: `${type} ${action}`,
      documentsVerified: verified,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};