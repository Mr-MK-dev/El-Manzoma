ALTER TABLE NEWAFRAAD.dbo.Unit ADD FollowedWeaponID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD CommandAreasID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD FollowingAreasID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD PatternID int NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD PackagingCode nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD StatisticsCode nvarchar(50) NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD Formation nvarchar(50) NULL;

-- NEWAFRAAD.dbo.Pattern definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.Pattern;

CREATE TABLE newManzoma.dbo.Pattern (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	Name nvarchar(100) COLLATE Arabic_CI_AS NOT NULL,
	CONSTRAINT PK__Pattern__2DF8989E39DFE406 PRIMARY KEY (ID_KEY)
);

-- NEWAFRAAD.dbo.FollowingAreas definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.FollowingAreas;

CREATE TABLE NEWAFRAAD.dbo.FollowingAreas (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	Name nvarchar(100) COLLATE Arabic_CI_AS NOT NULL,
	CONSTRAINT PK__Followin__2DF8989E34F93EA4 PRIMARY KEY (ID_KEY)
);
-- NEWAFRAAD.dbo.CommandRegions definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.CommandRegions;

CREATE TABLE NEWAFRAAD.dbo.CommandRegions (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	Name nvarchar(100) COLLATE Arabic_CI_AS NOT NULL,
	CONSTRAINT PK__CommandR__2DF8989E48C97401 PRIMARY KEY (ID_KEY)
);

-- NEWAFRAAD.dbo.MortabatDuties definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.MortabatDuties;

CREATE TABLE NEWAFRAAD.dbo.MortabatDuties (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	UnitID int NULL,
	WeaponDutyID int NULL,
	Category nvarchar(10) COLLATE Arabic_CI_AS NULL,
	[Level] nvarchar(10) COLLATE Arabic_CI_AS NULL,
	ServiceType nvarchar(10) COLLATE Arabic_CI_AS NULL,
	Moratab int NOT NULL,
	Siasa int NOT NULL,
	CONSTRAINT PK__Mortabat__2DF8989EA3ECCAE4 PRIMARY KEY (ID_KEY)
);


-- NEWAFRAAD.dbo.MortabatDuties foreign keys

ALTER TABLE NEWAFRAAD.dbo.MortabatDuties ADD CONSTRAINT FK__MortabatD__UnitI__76026BA8 FOREIGN KEY (UnitID) REFERENCES NEWAFRAAD.dbo.Unit(UnitID);
ALTER TABLE NEWAFRAAD.dbo.MortabatDuties ADD CONSTRAINT FK__MortabatD__Weapo__76F68FE1 FOREIGN KEY (WeaponDutyID) REFERENCES NEWAFRAAD.dbo.WeaponDutyPivot(ID_KEY);

-- NEWAFRAAD.dbo.WeaponDutyPivot definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.WeaponDutyPivot;

CREATE TABLE NEWAFRAAD.dbo.WeaponDutyPivot (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	DutyID int NULL,
	WeaponID int NULL,
	CONSTRAINT PK__WeaponDu__2DF8989E5CAEE392 PRIMARY KEY (ID_KEY)
);


-- NEWAFRAAD.dbo.WeaponDutyPivot foreign keys

ALTER TABLE NEWAFRAAD.dbo.WeaponDutyPivot ADD CONSTRAINT FK__WeaponDut__DutyI__62EF9734 FOREIGN KEY (DutyID) REFERENCES NEWAFRAAD.dbo.Duty(DutyID);
ALTER TABLE NEWAFRAAD.dbo.WeaponDutyPivot ADD CONSTRAINT FK__WeaponDut__Weapo__63E3BB6D FOREIGN KEY (WeaponID) REFERENCES NEWAFRAAD.dbo.Weapon(WeaponID);


ALTER TABLE NEWAFRAAD.dbo.Duty ADD WeaponID int NULL;
