ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD DegreeOfImportance nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD UserId int NULL;

ALTER TABLE NEWAFRAAD.dbo.OfficerSoldierRecommendation ADD DegreeOfImportance nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.OfficerSoldierRecommendation ADD UserId int NULL;

ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD DegreeOfImportance nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD UserId int NULL;

ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD DegreeOfImportance nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD UserId int NULL;