ALTER TABLE NEWAFRAAD.dbo.followersolider ADD FollowerEndDate date NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD FollowerEndCause nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD OrderOfEndFollower nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD RecieverName nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD RecommendationOrSelection nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD Recommender nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD FollowerDuty nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD isRecommended bit NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD isSelected bit NULL;


ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD FollowerDuty nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD FollowerEndCause nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD OrderOfEndFollower nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD FollowerEndDate date NULL;



ALTER TABLE NEWAFRAAD.dbo.Followerrateb ALTER COLUMN notes nvarchar(50) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ALTER COLUMN Suputer nvarchar COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ALTER COLUMN followplace int NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ALTER COLUMN Orderoffolwer nvarchar(50) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ALTER COLUMN workplace int NULL;

ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD isRecommended bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD isSelected bit NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider ADD Recommender nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD Recommender nvarchar(100) COLLATE Arabic_CI_AS NULL;


