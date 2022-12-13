ALTER TABLE NEWAFRAAD.dbo.PointHub ADD SoldierCount int NULL;
ALTER TABLE NEWAFRAAD.dbo.PointHub ADD RatebCount int NULL;
ALTER TABLE NEWAFRAAD.dbo.PointHub ADD OfficerCount int NULL;

ALTER TABLE NEWAFRAAD.dbo.Point ADD SoldierCount int NULL;
ALTER TABLE NEWAFRAAD.dbo.Point ADD RatebCount int NULL;
ALTER TABLE NEWAFRAAD.dbo.Point ADD OfficerCount int NULL;

ALTER TABLE NEWAFRAAD.dbo.Unit ADD isActivated nvarchar(50) NULL;

ALTER TABLE NEWAFRAAD.dbo.Point ADD isHeadQuarter bit NULL;

ALTER TABLE NEWAFRAAD.dbo.PointHub ADD isHeadQuarter bit NULL;
ALTER TABLE NEWAFRAAD.dbo.PointHub ADD isBian bit NULL;

