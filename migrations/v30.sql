ALTER TABLE NewAFRAAD.dbo.Direction ALTER COLUMN RecuRegion nchar(105) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.Direction ALTER COLUMN KnowledgeLevel nvarchar(105) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.Direction ALTER COLUMN Direction nvarchar(105) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.Users_ ADD canEditRateb bit NULL;


INSERT INTO NEWAFRAAD.dbo.SystemRules
([Key], Value)
VALUES('SMRecommendations', 1);

INSERT INTO NEWAFRAAD.dbo.SystemRules
([Key], Value)
VALUES('Recommendations', 1);

INSERT INTO NEWAFRAAD.dbo.SystemRules
([Key], Value)
VALUES('RecommendationsAndSelections', 1);

ALTER TABLE NEWAFRAAD.dbo.Soldier ADD SoldierEndDate date NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD RatebEndDate date NULL;


