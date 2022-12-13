ALTER TABLE NEWAFRAAD.dbo.Unit ADD Category varchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.RecommendationAndSelections ADD GeneralNotes varchar(100) NULL;


ALTER TABLE NEWAFRAAD.dbo.OutOfRenew ALTER COLUMN Reasons nvarchar(500) COLLATE Arabic_CI_AS NOT NULL;


ALTER TABLE NEWAFRAAD.dbo.Rateb ADD isChecked varchar(100) NULL;



ALTER TABLE NEWAFRAAD.dbo.Unit ADD ShapeType nvarchar(100) NULL;
