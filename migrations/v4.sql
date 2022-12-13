INSERT into Specialization (Specialization)  select DISTINCT Specialization  from Soldier  
-- NewAFRAAD.dbo.Specialization definition

-- Drop table

-- DROP TABLE NewAFRAAD.dbo.Specialization;

CREATE TABLE NewAFRAAD.dbo.Specialization (
	IDKey int IDENTITY(1,1) NOT NULL,
	Specialization nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__Speciali__939E78BBBBB63DF5 PRIMARY KEY (IDKey)
);


ALTER TABLE NewAFRAAD.dbo.SMRecommandations ADD latterHasSent bit DEFAULT 0 NULL;
ALTER TABLE NewAFRAAD.dbo.RecommendationAndSelections ADD officerLatterHasSent bit DEFAULT 0 NULL;
ALTER TABLE NewAFRAAD.dbo.RecommendationAndSelections ADD weaponLatterHasSent bit DEFAULT 0 NULL;
ALTER TABLE NewAFRAAD.dbo.Duty ADD isDeleted bit DEFAULT 0 NULL;


-- NEWAFRAAD.dbo.SoldiersMedicalSituations definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.SoldiersMedicalSituations;

CREATE TABLE NEWAFRAAD.dbo.SoldiersMedicalSituations (
	SituationID int IDENTITY(1,1) NOT NULL,
	ID nvarchar(13) COLLATE Arabic_CI_AS NOT NULL,
	Situation nvarchar(100) COLLATE Arabic_CI_AS NULL,
	SituationDate date NULL,
	Continuity bit NULL,
	Notes nvarchar(100) COLLATE Arabic_CI_AS NULL,
	CONSTRAINT PK__Soldiers__7E44DA787FD2B4F1 PRIMARY KEY (SituationID)
);


-- NEWAFRAAD.dbo.SoldiersMedicalSituations foreign keys

ALTER TABLE NEWAFRAAD.dbo.SoldiersMedicalSituations ADD CONSTRAINT FK__SoldiersMedi__ID__11207638 FOREIGN KEY (ID) REFERENCES NEWAFRAAD.dbo.Soldier(ID);


-- NEWAFRAAD.dbo.RatebPenalities definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.RatebPenalities;

CREATE TABLE NEWAFRAAD.dbo.RatebPenalities (
	IDKEY int IDENTITY(1,1) NOT NULL,
	ID nvarchar(100) COLLATE Arabic_CI_AS NULL,
	[date] datetimeoffset NULL,
	crimeText nvarchar(255) COLLATE Arabic_CI_AS NULL,
	crimeFromDate datetimeoffset NULL,
	crimeToDate datetimeoffset NULL,
	periodInDays int NULL,
	[order] nvarchar(255) COLLATE Arabic_CI_AS NULL,
	kind nvarchar(255) COLLATE Arabic_CI_AS NULL,
	withSalaryCut bit NULL,
	fromDate datetimeoffset NULL,
	toDate datetimeoffset NULL,
	orderNumber nvarchar(255) COLLATE Arabic_CI_AS NULL,
	orderDate datetimeoffset NULL,
	[type] nvarchar(255) COLLATE Arabic_CI_AS NULL,
	isCourt bit NOT NULL,
	courtDate datetimeoffset NULL,
	courtPlace nvarchar(255) COLLATE Arabic_CI_AS NULL,
	CONSTRAINT PK__RatebPen__93997C839A21DF97 PRIMARY KEY (IDKEY)
);


-- NEWAFRAAD.dbo.RatebPenalities foreign keys

ALTER TABLE NEWAFRAAD.dbo.RatebPenalities ADD CONSTRAINT FK__RatebPenalit__ID__4D35603F FOREIGN KEY (ID) REFERENCES NEWAFRAAD.dbo.Rateb(ID) ON DELETE SET NULL;