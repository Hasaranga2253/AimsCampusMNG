/*
  Warnings:

  - You are about to drop the column `academicModuleId` on the `ModuleStaffAssignment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ModuleStaffAssignment" DROP CONSTRAINT "ModuleStaffAssignment_academicModuleId_fkey";

-- AlterTable
ALTER TABLE "ModuleStaffAssignment" DROP COLUMN "academicModuleId";
