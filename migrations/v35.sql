ALTER TABLE NewAFRAAD.dbo.CompletePlanUnit ADD PackageCode varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.OutOfRenew ALTER COLUMN Reasons nvarchar(4000) COLLATE Arabic_CI_AS NOT NULL;

ALTER TABLE NewAFRAAD.dbo.Employment ADD WorkDate date NULL;
ALTER TABLE NewAFRAAD.dbo.Employment ADD EmploymentDate date NULL;
ALTER TABLE NewAFRAAD.dbo.Employment ADD PhoneNumber varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.ParentsAndBrothers ALTER COLUMN Status nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.ParentsAndBrothers ALTER COLUMN RelevantType nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.ParentsAndBrothers ALTER COLUMN Address nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.ParentsAndBrothers ALTER COLUMN tele nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.ParentsAndBrothers ALTER COLUMN RelevantName nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.MartyrWifeAndSon ADD ChildBirthDate date NULL;



ALTER TABLE NewAFRAAD.dbo.IdealSoldier ADD [Type] varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.ExcellentParent ADD HonorYear int NULL;
ALTER TABLE NewAFRAAD.dbo.ExcellentParent ADD Place varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.ExcellentParent ADD Honor varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.ExcellentParent ADD isReject bit NULL;
ALTER TABLE NewAFRAAD.dbo.ExcellentParent ADD RejectNotes varchar(100) NULL;


ALTER TABLE NEWAFRAAD.dbo.AcademicallyExcellence ADD Honor varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.AcademicallyExcellence ADD HonorYear int NULL;
ALTER TABLE NewAFRAAD.dbo.IdealSoldier ADD Honor varchar(100) NULL;
