const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRICE_CHANGE_PERCENT = 0.1; 
const ACTIVE_USER_THRESHOLD = 5; 

const adjustVehiclePrices = async () => {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const activeUserGroups = await prisma.userActivity.groupBy({
    by: ['userId'],
    where: {
      accessedAt: {
        gte: twelveHoursAgo,
      },
    },
  });

  const activeUserCount = activeUserGroups.length;

  const vehicles = await prisma.vehicle.findMany();

  for (const vehicle of vehicles) {
    let adjustedRate = vehicle.rate;

    if (activeUserCount >= ACTIVE_USER_THRESHOLD) {
      adjustedRate = vehicle.rate * (1 + PRICE_CHANGE_PERCENT); 
    } else {
      adjustedRate = vehicle.rate * (1 - PRICE_CHANGE_PERCENT); 
    }

    adjustedRate = Math.round(adjustedRate * 100) / 100;

    if (adjustedRate !== vehicle.adjustedRate) {
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { adjustedRate },
      });
    }
  }

  console.log(`Adjusted vehicle prices based on ${activeUserCount} active users.`);
};

module.exports = adjustVehiclePrices;
