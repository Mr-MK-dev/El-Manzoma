ALTER TABLE NEWAFRAAD.dbo.userTracking  ADD changes nvarchar(255) NULL;


ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD KnowledgeLevel nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD RecuRigion nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD firstDesire nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD secondDesire nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD thirdDesire nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD CityID int NULL;


ALTER TABLE NEWAFRAAD.dbo.Unit ADD ShortenName nvarchar(30) NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD SpecialOrganizationID int NULL;


ALTER TABLE NEWAFRAAD.dbo.Users_ DROP COLUMN GroupId;
ALTER TABLE NEWAFRAAD.dbo.Users_ ADD GroupIds nvarchar(100) NULL;
