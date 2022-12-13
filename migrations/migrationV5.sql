ALTER TABLE NewAFRAAD.dbo.Rateb ADD lastScrapingStatus bit NULL;
-- NewAFRAAD.dbo.RatebPromotions definition

-- Drop table

-- DROP TABLE NewAFRAAD.dbo.RatebPromotions;

CREATE TABLE NewAFRAAD.dbo.RatebPromotions (
	IDKEY int IDENTITY(1,1) NOT NULL,
	ID nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[type] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT N'' NULL,
	[degree] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT N'' NULL,
	[date] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT N'' NULL,
	orderNumber nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT N'' NULL,
	orderDate nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT N'' NULL,
	CONSTRAINT PK__RatebPro__93997C83EF4948AF PRIMARY KEY (IDKEY)
);


-- NewAFRAAD.dbo.RatebPromotions foreign keys

ALTER TABLE NewAFRAAD.dbo.RatebPromotions ADD CONSTRAINT FK__RatebPromoti__ID__6A1BB7B0 FOREIGN KEY (ID) REFERENCES NewAFRAAD.dbo.Rateb(ID) ON DELETE SET NULL;

UPDATE followersolider 
SET isEnrolled = 0
FROM  Soldier s where s.SoldierStatus != N'بالخدمة' and followersolider.ID  = s.ID
 
ALTER TABLE NEWAFRAAD.dbo.Soldier ADD isPrinted bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Soldier ADD createdAt date NULL;
FROM  Soldier s where s.SoldierStatus != N'بالخدمة' and followersolider.ID  = s.ID 

ALTER TABLE NewAFRAAD.dbo.Users_ ADD permissions varchar(MAX) NULL;
ALTER TABLE NewAFRAAD.dbo.Users_ ADD randomKey bit NULL;
ALTER TABLE NewAFRAAD.dbo.Users_ ALTER COLUMN randomKey int NULL;
