ALTER TABLE NEWAFRAAD.dbo.RatebPunishments ADD isRemoved bit DEFAULT 0 NULL;


ALTER TABLE NEWAFRAAD.dbo.InternalFollowUp ALTER COLUMN GroupId nvarchar(100) NOT NULL;


ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD SecondRecommender varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD SecondRecommender varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD SecondRecommender varchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD Category varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD Category varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD Category varchar(100) NULL;


ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD Exclusion bit NULL;
ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD Exclusion bit NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD Exclusion bit NULL;


