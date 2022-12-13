ALTER TABLE NEWAFRAAD.dbo.RatebPenalities ADD PunishmentTypeID int NULL;


ALTER TABLE NEWAFRAAD.dbo.RenewAddPlans ADD RenewType varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.RenewRemovePlans ADD RenewType varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Brothers ADD BrotherMilitaryID nvarchar(13) NULL;


ALTER TABLE NEWAFRAAD.dbo.RenewCandidates ADD  DEFAULT 0 FOR MedicalSituation;
ALTER TABLE NEWAFRAAD.dbo.RenewCandidates ADD  DEFAULT 0 FOR isHasRecommendation;
ALTER TABLE NEWAFRAAD.dbo.RenewCandidates ADD  DEFAULT 0 FOR isAgree;
