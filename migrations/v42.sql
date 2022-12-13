ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD AlarmDate date NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD AlarmDate date NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD AlarmNotes varchar(500) NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD AlarmNotes varchar(500) NULL;


ALTER TABLE NEWAFRAAD.dbo.followersolider ADD TrainingOrderDate date NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD TrainingOrderDate date NULL;

ALTER TABLE NEWAFRAAD.dbo.RatebRecommendations ALTER COLUMN TransferListID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Requests ALTER COLUMN TransferListID int NULL;

ALTER TABLE NEWAFRAAD.dbo.GeneralRequests ADD spentAmount nvarchar(100) NULL;
