ALTER TABLE NEWAFRAAD.dbo.PreviousJobs ADD WorkStatus int NULL;
ALTER TABLE NEWAFRAAD.dbo.PreviousJobs ADD Notes varchar(100) NULL;


ALTER TABLE NEWAFRAAD.dbo.Rateb DROP COLUMN FirstRenewDateFrom;
ALTER TABLE NEWAFRAAD.dbo.Rateb DROP COLUMN SecondRenewDateFrom;
ALTER TABLE NewAFRAAD.dbo.Requests ALTER COLUMN Note nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.PreviousJobs ADD RatebDegreeFromSpecialist int NULL;
ALTER TABLE NEWAFRAAD.dbo.PreviousJobs ADD RatebDegreeFromUnitLeader int NULL;
ALTER TABLE NEWAFRAAD.dbo.PreviousJobs ADD RatebDegreeFromBranchHead int NULL;
ALTER TABLE NEWAFRAAD.dbo.TransportLicense ALTER COLUMN RecuStage nvarchar(100) COLLATE Arabic_CI_AI_KS_WS NULL;


ALTER TABLE NEWAFRAAD.dbo.Rateb ADD FirstRenew bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD SecondRenew bit NULL;


ALTER TABLE NEWAFRAAD.dbo.TransferCandidates ADD OutOfJob bit NULL;

ALTER TABLE NEWAFRAAD.dbo.RenewCandidates ADD RenewType varchar(50) NULL;


ALTER TABLE NEWAFRAAD.dbo.Rateb ADD FirstRenewDateFrom date NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD SecondRenewDateFrom date NULL;


ALTER TABLE NEWAFRAAD.dbo.Rateb ADD FirstRenewDateTo date NULL;
ALTER TABLE NEWAFRAAD.dbo.Rateb ADD SecondRenewDateTo date NULL;

EXEC NEWAFRAAD.sys.sp_rename N'NEWAFRAAD.dbo.Rateb.SecondRenewDate' , N'SecondRenewDateFrom', 'COLUMN';
EXEC NEWAFRAAD.sys.sp_rename N'NEWAFRAAD.dbo.Rateb.FirstRenewDate' , N'FirstRenewDateTo', 'COLUMN';



