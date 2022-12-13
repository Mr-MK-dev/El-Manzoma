ALTER TABLE NEWAFRAAD.dbo.AddPlans ADD Notes varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.RemovePlans ADD Notes varchar(100) NULL;




ALTER TABLE NEWAFRAAD.dbo.SoldiersMedicalSituations ADD TakenAction nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.SoldierSecuritySituations ADD Continuity bit DEFAULT 0 NOT NULL;
ALTER TABLE NEWAFRAAD.dbo.SoldierSecuritySituations ADD TakenAction nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Situations ADD TakenAction nvarchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.punshments ADD PunishmentTypeID int NULL;


ALTER TABLE NEWAFRAAD.dbo.tahel ADD TahelCourseID int NULL;




ALTER TABLE NEWAFRAAD.dbo.Brothers ADD BrotherMilitaryID nvarchar(13) COLLATE SQL_Latin1_General_CP1_CI_AS NULL;
