ALTER TABLE NEWAFRAAD.dbo.RemovePlans ADD isChecked bit NULL;
ALTER TABLE NEWAFRAAD.dbo.AddPlans ADD isChecked bit NULL;

ALTER TABLE NEWAFRAAD.dbo.RenewAddPlans ADD isChecked bit NULL;
ALTER TABLE NEWAFRAAD.dbo.RenewRemovePlans ADD isChecked bit NULL;



ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD ExclusionNotes varchar(300) NULL;
ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD ExclusionNotes varchar(300) NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD ExclusionNotes varchar(300) NULL;


ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD Government varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD Government varchar(100) NULL;



ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD FinalResult varchar(200) NULL;
ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD isUnitFollow bit NULL;
ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD isUnitFollow bit NULL;

ALTER TABLE NEWAFRAAD.dbo.Recommendations ADD DateAdded date NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD DateAdded date NULL;
ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD DateAdded date NULL;
ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD Government varchar(100) NULL;




