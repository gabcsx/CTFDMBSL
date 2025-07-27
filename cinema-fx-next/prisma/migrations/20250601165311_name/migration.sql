/*
  Warnings:

  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[OrderItem] DROP CONSTRAINT [OrderItem_productId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[OrderItem] DROP CONSTRAINT [OrderItem_transactionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Transaction] DROP CONSTRAINT [Transaction_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Transaction] DROP COLUMN [userId];
ALTER TABLE [dbo].[Transaction] ADD [email] NVARCHAR(1000) NOT NULL,
[username] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[OrderItem];

-- CreateTable
CREATE TABLE [dbo].[OrderedItem] (
    [id] INT NOT NULL IDENTITY(1,1),
    [transactionId] INT NOT NULL,
    [productId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [subtotal] INT NOT NULL,
    CONSTRAINT [OrderedItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[OrderedItem] ADD CONSTRAINT [OrderedItem_transactionId_fkey] FOREIGN KEY ([transactionId]) REFERENCES [dbo].[Transaction]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderedItem] ADD CONSTRAINT [OrderedItem_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
