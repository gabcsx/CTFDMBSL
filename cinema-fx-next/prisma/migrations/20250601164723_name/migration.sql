/*
  Warnings:

  - You are about to drop the column `email` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `_TransactionProducts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `totalPrice` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_TransactionProducts] DROP CONSTRAINT [_TransactionProducts_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_TransactionProducts] DROP CONSTRAINT [_TransactionProducts_B_fkey];

-- AlterTable
ALTER TABLE [dbo].[Transaction] DROP COLUMN [email],
[username];
ALTER TABLE [dbo].[Transaction] ADD [totalPrice] INT NOT NULL,
[userId] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[_TransactionProducts];

-- CreateTable
CREATE TABLE [dbo].[OrderItem] (
    [id] INT NOT NULL IDENTITY(1,1),
    [transactionId] INT NOT NULL,
    [productId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [subTotal] INT NOT NULL,
    CONSTRAINT [OrderItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Transaction] ADD CONSTRAINT [Transaction_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_transactionId_fkey] FOREIGN KEY ([transactionId]) REFERENCES [dbo].[Transaction]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
