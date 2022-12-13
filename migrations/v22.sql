
ALTER TABLE NEWAFRAAD.dbo.Unit ADD ShapeType nvarchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.SoldiersSelectionSituations  ADD Advocate nvarchar(200) NULL;
ALTER TABLE NEWAFRAAD.dbo.SoldiersMedicalSituations  ADD Advocate nvarchar(200) NULL;
ALTER TABLE NEWAFRAAD.dbo.SoldiersPhsycoligicalSituations  ADD Advocate nvarchar(200) NULL;
ALTER TABLE NEWAFRAAD.dbo.SoldierSecuritySituations  ADD Advocate nvarchar(200) NULL;

ALTER TABLE NEWAFRAAD.dbo.SMRecommandations  ADD Certificator nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections  ADD Certificator nvarchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.Colleges ADD KnowledgeLevel nvarchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD College nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD Specialization nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations  ADD College nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations  ADD Specialization nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections  ADD College nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections  ADD Specialization nvarchar(50) NULL;



ALTER TABLE NEWAFRAAD.dbo.Users_ ADD GroupId int NULL;


