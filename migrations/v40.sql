ALTER TABLE NEWAFRAAD.dbo.Officers ADD Job varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.OfficerCourses ALTER COLUMN Notes nvarchar(255) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.OfficerMissions ALTER COLUMN Notes nvarchar(255) COLLATE Arabic_CI_AS NULL;
ALTER TABLE NEWAFRAAD.dbo.OfficerVacations ALTER COLUMN Notes nvarchar(255) COLLATE Arabic_CI_AS NULL;



ALTER TABLE NEWAFRAAD.dbo.OfficerVacations ADD Yearly int NULL;
ALTER TABLE NEWAFRAAD.dbo.OfficerVacations ADD Occasional int NULL;
