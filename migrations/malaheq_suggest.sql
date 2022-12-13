-- remove pk constraints
ALTER TABLE NEWAFRAAD.dbo.Followers ADD WorkPlaceID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Followers DROP COLUMN SerialNo;
ALTER TABLE dbo.Followers
   ADD ID_KEY INT IDENTITY
       CONSTRAINT PK_Followers PRIMARY KEY CLUSTERED
ALTER TABLE NewAFRAAD.dbo.Followers ALTER COLUMN FollowRigionID int NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ALTER COLUMN FollowingOrder nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ALTER COLUMN FollowingRecommender nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ADD isSelected bit NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ADD isRecommended bit NULL;