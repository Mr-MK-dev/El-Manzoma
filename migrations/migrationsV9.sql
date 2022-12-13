ALTER TABLE NEWAFRAAD.dbo.Unit ADD OrderNo int NULL;
ALTER TABLE NEWAFRAAD.dbo.Unit ADD OrderDate date NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ADD Status varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Rateb ADD Status varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ALTER COLUMN Status varchar(100) COLLATE Arabic_CI_AI NULL;
INSERT INTO NewAFRAAD.dbo.Duty (Duty,isDeleted,WeaponID) VALUES
	 (N'وظيفة غير موجودة في الوحدة',NULL,NULL);