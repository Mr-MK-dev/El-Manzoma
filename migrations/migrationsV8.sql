-- NEWAFRAAD.dbo.MortabatDuties definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.MortabatDuties;

CREATE TABLE NEWAFRAAD.dbo.MortabatDuties (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	UnitID int NULL,
	DutyID int NULL,
	WeaponID int NULL,
	Category nvarchar(10) COLLATE Arabic_CI_AS NULL,
	[Level] nvarchar(10) COLLATE Arabic_CI_AS NULL,
	ServiceType nvarchar(10) COLLATE Arabic_CI_AS NULL,
	Moratab int NOT NULL,
	Siasa int NOT NULL,
	CONSTRAINT PK__Mortabat__2DF8989E445E9A3D PRIMARY KEY (ID_KEY)
);


-- NEWAFRAAD.dbo.MortabatDuties foreign keys

ALTER TABLE NEWAFRAAD.dbo.MortabatDuties ADD CONSTRAINT FK__MortabatD__DutyI__5654B625 FOREIGN KEY (DutyID) REFERENCES NEWAFRAAD.dbo.Duty(DutyID);
ALTER TABLE NEWAFRAAD.dbo.MortabatDuties ADD CONSTRAINT FK__MortabatD__UnitI__556091EC FOREIGN KEY (UnitID) REFERENCES NEWAFRAAD.dbo.Unit(UnitID) ON DELETE SET NULL;
ALTER TABLE NEWAFRAAD.dbo.MortabatDuties ADD CONSTRAINT FK__MortabatD__Weapo__5748DA5E FOREIGN KEY (WeaponID) REFERENCES NEWAFRAAD.dbo.Weapon(WeaponID);


ALTER TABLE NEWAFRAAD.dbo.Users_ ADD canEdit bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Pattern ADD State bit NULL;
ALTER TABLE NEWAFRAAD.dbo.FollowingAreas ADD State bit NULL;
ALTER TABLE NEWAFRAAD.dbo.RatebTraineeShip ADD state nvarchar(50) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.CommandRegions ADD State bit NULL;


ALTER TABLE dbo.prevlevelup
   ADD ID_KEY INT IDENTITY
       CONSTRAINT PK_prevlevelup PRIMARY KEY CLUSTERED


ALTER TABLE NEWAFRAAD.dbo.MortabatDuties ADD SoldiersCompletenessPercentage int NULL;

ALTER TABLE NEWAFRAAD.dbo.MortabatDuties ADD RatebsCompletenessPercentage int NULL;

ALTER TABLE NEWAFRAAD.dbo.Unit ADD Moratab int NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD Siasa int NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD SoldiersCompletenessPercentage int NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD RatebsCompletenessPercentage int NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD direction nvarchar(50) NULL;



