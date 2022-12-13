ALTER TABLE NEWAFRAAD.dbo.Soldier ADD LevelStatus nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD LevelStatus nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Officer ADD LevelStatus nvarchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.Soldier ALTER COLUMN SoldierTELE nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ALTER COLUMN PhoneNumber nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ALTER COLUMN Address nvarchar(500) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Soldier ALTER COLUMN IdentityNo nvarchar(50) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjuredAndDeath ALTER COLUMN DisabilityRatio nvarchar(500) NULL;

ALTER TABLE NEWAFRAAD.dbo.ReasonsDecisions ADD [Type] varchar(100) NULL;

