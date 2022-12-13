ALTER TABLE NEWAFRAAD.dbo.Rateb ADD CurrentJobID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Jobs ADD isCritical bit NULL;
UPDATE  Soldier set  isPrinted = 0 where isPrinted Is NULL
ALTER TABLE NewAFRAAD.dbo.TransferAllocation ALTER COLUMN DecisionNotes nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD FirstRenew bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD SecondRenew bit NULL;
ALTER TABLE NEWAFRAAD.dbo.punshments ALTER COLUMN ID nvarchar(100) COLLATE Arabic_CI_AS NOT NULL;
