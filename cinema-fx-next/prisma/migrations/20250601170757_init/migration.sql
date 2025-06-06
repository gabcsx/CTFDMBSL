/*
  Warnings:

  - You are about to drop the `OrderedItem` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[OrderedItem] DROP CONSTRAINT [OrderedItem_productId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[OrderedItem] DROP CONSTRAINT [OrderedItem_transactionId_fkey];

-- DropTable
DROP TABLE [dbo].[OrderedItem];

-- CreateTable
CREATE TABLE [dbo].[OrderItem] (
    [id] INT NOT NULL IDENTITY(1,1),
    [transactionId] INT NOT NULL,
    [productId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [price] INT NOT NULL,
    CONSTRAINT [OrderItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_TransactionProducts] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_TransactionProducts_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_TransactionProducts_B_index] ON [dbo].[_TransactionProducts]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_transactionId_fkey] FOREIGN KEY ([transactionId]) REFERENCES [dbo].[Transaction]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TransactionProducts] ADD CONSTRAINT [_TransactionProducts_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Product]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TransactionProducts] ADD CONSTRAINT [_TransactionProducts_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Transaction]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
