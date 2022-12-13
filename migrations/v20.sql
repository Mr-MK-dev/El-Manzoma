ALTER TABLE NEWAFRAAD.dbo.Unit ADD minimumDegree nvarchar(100) COLLATE Arabic_CI_AI_KS_WS NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ALTER COLUMN extraProfitType int NULL;

ALTER TABLE NEWAFRAAD.dbo.followersolider ADD isTrainingOrder bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD isTrainingOrder bit NULL;

ALTER TABLE NEWAFRAAD.dbo.Recommendations ALTER COLUMN UnitID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations ALTER COLUMN Matching nvarchar(10) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations ALTER COLUMN Certificator nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations DROP CONSTRAINT PK__Recommen__D9CAA95A32A9C64F;
DROP INDEX PK__Recommen__D9CAA95A32A9C64F ON NEWAFRAAD.dbo.Recommendations;
ALTER TABLE NEWAFRAAD.dbo.Recommendations DROP CONSTRAINT FK__Recommend__UnitI__6DD739FB;


ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD Notes varchar(100) NULL;
