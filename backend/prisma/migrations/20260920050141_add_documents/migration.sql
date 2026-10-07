-- AlterTable
ALTER TABLE `user` ADD COLUMN `documentsVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `drivingLicenseBack` VARCHAR(191) NULL,
    ADD COLUMN `drivingLicenseFront` VARCHAR(191) NULL,
    ADD COLUMN `drivingLicenseRejection` VARCHAR(191) NULL,
    ADD COLUMN `drivingLicenseStatus` VARCHAR(191) NOT NULL DEFAULT 'not_uploaded',
    ADD COLUMN `licenseExpiry` DATETIME(3) NULL,
    ADD COLUMN `nationalIdBack` VARCHAR(191) NULL,
    ADD COLUMN `nationalIdFront` VARCHAR(191) NULL,
    ADD COLUMN `nationalIdRejection` VARCHAR(191) NULL,
    ADD COLUMN `nationalIdStatus` VARCHAR(191) NOT NULL DEFAULT 'not_uploaded';
