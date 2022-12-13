ALTER TABLE NewAFRAAD.dbo.Soldier ADD lastScrapingStatus bit NULL;


ALTER TABLE NEWAFRAAD.dbo.FinancialDues ADD MedicalInsurance bit NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ADD MartyrWifeAndSon varchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ADD NationalID varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Honors ADD granteeName varchar(100) NULL;


ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ALTER COLUMN Sons int NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ALTER COLUMN Daughters int NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ALTER COLUMN tele nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ALTER COLUMN Address nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ALTER COLUMN WifeName nvarchar(100) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ADD  DEFAULT 0 FOR Sons;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ADD  DEFAULT 0 FOR Daughters;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ADD ChildName varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ADD ChildKind varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrWifeAndSon ADD ChildNationalID varchar(100) NULL;



ALTER TABLE NEWAFRAAD.dbo.ParentsAndBrothers ADD NationalID varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjured ADD [Image] varchar(MAX) NULL;
