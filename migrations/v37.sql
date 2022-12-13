ALTER TABLE NEWAFRAAD.dbo.AcademicallyExcellence ADD isReject bit NULL;
ALTER TABLE NEWAFRAAD.dbo.AcademicallyExcellence ADD RejectNotes nvarchar(1000) NULL;

ALTER TABLE NEWAFRAAD.dbo.Officers ADD Status varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD Address nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD PhoneNumber nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD KnowledgeLevel nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD Religion nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD IdentityNo nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD MartialStatus nvarchar(50) NULL;


ALTER TABLE NEWAFRAAD.dbo.Demands ADD MilitaryType nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Housing  ADD MilitaryType nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Employment  ADD MilitaryType nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.FinancialDues  ADD MilitaryType nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Hajj  ADD MilitaryType nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Honors  ADD MilitaryType nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon  ADD MilitaryType nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.ParentsAndBrothers  ADD MilitaryType nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.PublicName  ADD MilitaryType nvarchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.Demands ADD Kind nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Housing  ADD Kind nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Employment  ADD Kind nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.FinancialDues  ADD Kind nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Hajj  ADD Kind nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Honors  ADD Kind nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon  ADD Kind nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.ParentsAndBrothers  ADD Kind nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.PublicName  ADD Kind nvarchar(100) NULL;

EXEC NEWAFRAAD.sys.sp_rename N'NEWAFRAAD.dbo.Housing.Name' , N'BeneficiaryName', 'COLUMN';
EXEC NEWAFRAAD.sys.sp_rename N'NEWAFRAAD.dbo.Housing.PhoneNumber' , N'BeneficiaryPhoneNumber', 'COLUMN';



DROP TABLE NEWAFRAAD.dbo.MedicalRequestsk
DROP TABLE NEWAFRAAD.dbo.ExcellentParent
DROP TABLE NEWAFRAAD.dbo.AcademicallyExcellence
DROP TABLE NEWAFRAAD.dbo.PsychologicalRequests
DROP TABLE NEWAFRAAD.dbo.Vaccinators
DROP TABLE NEWAFRAAD.dbo.InjuredHospitals


ALTER TABLE NEWAFRAAD.dbo.PunishmentTypes ADD isRenewBlocked bit NULL;
ALTER TABLE NEWAFRAAD.dbo.PunishmentTypes ADD periodInDays int NULL;

ALTER TABLE NEWAFRAAD.dbo.followerwork ADD ordernum int NULL;
ALTER TABLE NEWAFRAAD.dbo.followerwork ADD PrimaryPower int NULL;
ALTER TABLE NEWAFRAAD.dbo.followerwork DROP COLUMN PrimaryPower;
ALTER TABLE NEWAFRAAD.dbo.followerwork ADD PrimaryPowerRateb int NULL;
ALTER TABLE NEWAFRAAD.dbo.followerwork ADD PrimaryPowerSoldier int NULL;



