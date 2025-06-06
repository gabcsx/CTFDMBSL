BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Transaction] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [purchaseDate] DATETIME2 NOT NULL CONSTRAINT [Transaction_purchaseDate_df] DEFAULT CURRENT_TIMESTAMP,
    [status] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Transaction_pkey] PRIMARY KEY CLUSTERED ([id])
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
