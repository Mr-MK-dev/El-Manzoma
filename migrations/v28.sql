ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD FinalResult nvarchar(200) NULL;

ALTER TABLE NEWAFRAAD.dbo.TransferList ADD TimeStart int NULL;
ALTER TABLE NEWAFRAAD.dbo.TransferList ADD TimeFirstSergant int NULL;
ALTER TABLE NEWAFRAAD.dbo.TransferList ADD Notes nvarchar(4000) NULL;

ALTER TABLE NEWAFRAAD.dbo.Rateb ADD SpecialistRate int NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD UnitLeaderRate int NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD LeaderRate int NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD AverageRate int NULL;

ALTER TABLE NEWAFRAAD.dbo.Users_ ALTER COLUMN permissions text COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Users_ ADD deletePermissions text NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD isRaiseEfficiency bit NULL;



