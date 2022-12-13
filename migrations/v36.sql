ALTER TABLE NEWAFRAAD.dbo.AcademicallyExcellence ADD isHonor bit NULL;
ALTER TABLE NewAFRAAD.dbo.ExcellentParent ADD isHonor bit DEFAULT 0 NULL;


ALTER TABLE NEWAFRAAD.dbo.MedicalRequests ADD Notes varchar(1000) NULL;
ALTER TABLE NEWAFRAAD.dbo.Soldier ADD SecurityExcludedFromPackaging bit DEFAULT 0 NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjured ALTER COLUMN [Image] nvarchar(MAX) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjured ALTER COLUMN photo nvarchar(MAX) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjured ALTER COLUMN isFollowed bit NULL;
