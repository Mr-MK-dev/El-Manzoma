ALTER TABLE NEWAFRAAD.dbo.Selections DROP COLUMN WeaponIDs;
-- NewAFRAAD.dbo.RecommendationAndSelections definition

-- Drop table

-- DROP TABLE NewAFRAAD.dbo.RecommendationAndSelections;

CREATE TABLE NewAFRAAD.dbo.RecommendationAndSelections (
	ID nvarchar(13) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ID_KEY int IDENTITY(1,1) NOT NULL,
	tripleNo nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	RecuStage nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Name nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	OfficerSoldierRecommendation nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	WeaponRecommendation nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Recommender nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	KnowledgeLevel nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Notes nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	OfficerSoldierResult nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	WeaponResult nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	isCertificated bit NULL,
	RecuRigion varchar(100) COLLATE Arabic_CI_AI NULL,
	CONSTRAINT PK__Recommen__2DF8989EAFBED508 PRIMARY KEY (ID_KEY)
);


ALTER TABLE NewAFRAAD.dbo.RecommendationAndSelections ADD OfficerSoldierStatus varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.RecommendationAndSelections ADD weaponRecommendations varchar(max) NULL;

ALTER TABLE NewAFRAAD.dbo.RecommendationAndSelections ALTER COLUMN OfficerSoldierStatus varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.RecommendationAndSelections ALTER COLUMN weaponRecommendations varchar(100) COLLATE Arabic_CI_AI NULL;
