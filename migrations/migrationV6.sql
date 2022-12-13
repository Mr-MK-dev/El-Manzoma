-- NEWAFRAAD.dbo.RatebTraineeShip definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.RatebTraineeShip;

CREATE TABLE NEWAFRAAD.dbo.RatebTraineeShip (
	ID_KEY int IDENTITY(1,1) NOT NULL,
	id nvarchar(13) COLLATE Arabic_CI_AS NOT NULL,
	TraineeShipID int NULL,
	count nvarchar(50) COLLATE Arabic_CI_AS NULL,
	grade nvarchar(50) COLLATE Arabic_CI_AS NULL,
	[degree] nvarchar(50) COLLATE Arabic_CI_AS NULL,
	place nvarchar(50) COLLATE Arabic_CI_AS NULL,
	date_from date NULL,
	date_to date NULL,
	CONSTRAINT PK__RatebTra__2DF8989E7D5D28CA PRIMARY KEY (ID_KEY)
);


-- NEWAFRAAD.dbo.RatebTraineeShip foreign keys

ALTER TABLE NEWAFRAAD.dbo.RatebTraineeShip ADD CONSTRAINT FK__RatebTrai__Treai__31233176 FOREIGN KEY (TraineeShipID) REFERENCES NEWAFRAAD.dbo.TraineeShip(TraineeShipID);

-- NEWAFRAAD.dbo.TraineeShip definition

-- Drop table

-- DROP TABLE NEWAFRAAD.dbo.TraineeShip;

CREATE TABLE NEWAFRAAD.dbo.TraineeShip (
	TraineeShipID int IDENTITY(1,1) NOT NULL,
	Name nvarchar(100) COLLATE Arabic_CI_AS NOT NULL,
	CONSTRAINT PK__TraineeS__4AD71134E2F3E341 PRIMARY KEY (TraineeShipID)
);