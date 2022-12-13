ALTER TABLE NewAFRAAD.dbo.RecommendationAndSelections ADD willContinuo bit NULL;
ALTER TABLE NewAFRAAD.dbo.Users_ ADD forceClose bit NULL;


ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD RecuRegion varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.SMRecommandations ADD Government varchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.RatebPenalities ADD isRemoved bit DEFAULT 0 NULL;
ALTER TABLE NEWAFRAAD.dbo.RenewCandidates ADD RenewDate date NULL;






ALTER TABLE NEWAFRAAD.dbo.SoldiersMedicalSituations ADD TakenAction varchar(1000) NULL;
ALTER TABLE NEWAFRAAD.dbo.SoldierSecuritySituations ADD TakenAction varchar(1000) NULL;
ALTER TABLE NEWAFRAAD.dbo.SoldierSecuritySituations ADD Continuity bit NULL;




ALTER TABLE NEWAFRAAD.dbo.Followers ADD isSelected bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Followers ADD isRecommended bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Followers ADD WorkPlaceID int NULL;

