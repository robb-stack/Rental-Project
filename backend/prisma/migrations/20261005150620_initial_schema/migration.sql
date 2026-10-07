-- AlterTable
ALTER TABLE `booking` ADD COLUMN `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `stripeSessionId` VARCHAR(191) NULL;
