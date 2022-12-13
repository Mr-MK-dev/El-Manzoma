ALTER TABLE NEWAFRAAD.dbo.RenewCandidates ALTER COLUMN CandidateGrade varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD Area varchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.OtherRenewCandidates ADD isRenewDone bit DEFAULT 0 NULL;
ALTER TABLE NEWAFRAAD.dbo.OtherRenewCandidates ADD Requirement bit DEFAULT 0 NULL;
ALTER TABLE NewAFRAAD.dbo.TransferAllocationSnapshot ADD OldUnitID int NULL;


ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjuredAndDeath ALTER COLUMN [Image] nvarchar(MAX) COLLATE Arabic_CI_AS NULL;

ALTER TABLE NEWAFRAAD.dbo.Soldier ADD MartialStatus varchar(50) NULL;

ALTER TABLE NEWAFRAAD.dbo.OutOfRenew ADD RenewType varchar(100) NULL;


ALTER TABLE NEWAFRAAD.dbo.Officers ADD BranchID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD CityID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD VacationID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD Yearly int NULL;
ALTER TABLE NEWAFRAAD.dbo.Officers ADD Occasional int NULL;



CREATE TABLE NEWAFRAAD.dbo.OfficerVacations (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	VacationID int NOT NULL,
	ID nvarchar(100) NOT NULL,
    isOccasional bit NULL,
    isAnnual bit NULL,
	Notes nvarchar(255) COLLATE Arabic_CI_AS NOT NULL,
	DateFrom date NOT NULL,
	DateTo date NOT NULL,
	CONSTRAINT PK__OfficerV__2DF8989EE4EAE63A PRIMARY KEY (ID_KEY)
);


CREATE TABLE NEWAFRAAD.dbo.OfficerCourses (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	CourseID int NOT NULL,
	ID nvarchar(100) NOT NULL,
	Notes nvarchar(255) COLLATE Arabic_CI_AS NOT NULL,
	DateFrom date NOT NULL,
	DateTo date NOT NULL,
	CONSTRAINT PK__OfficerC__2DF8989E3A64BCA3 PRIMARY KEY (ID_KEY)
);


CREATE TABLE NEWAFRAAD.dbo.OfficerMissions (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	MissionID int NOT NULL,
	ID nvarchar(100) COLLATE Arabic_CI_AS NOT NULL,
	Notes nvarchar(255) COLLATE Arabic_CI_AS NOT NULL,
	DateFrom date NOT NULL,
	DateTo date NOT NULL,
	CONSTRAINT PK__OfficerM__2DF8989E8CC506AF PRIMARY KEY (ID_KEY)
);