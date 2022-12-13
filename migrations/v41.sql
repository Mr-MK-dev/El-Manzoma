DROP TABLE NEWAFRAAD.dbo.UnitsOfficers
ALTER TABLE NEWAFRAAD.dbo.followerwork ADD LeaderCertification int NULL;


ALTER TABLE NEWAFRAAD.dbo.MilitaryManagementOfficers ADD OccasionalDaysCount int NULL;
ALTER TABLE NEWAFRAAD.dbo.MilitaryManagementOfficers ADD AnnualDaysCount int NULL;

DROP TABLE NEWAFRAAD.dbo.OfficerVacations;
ALTER TABLE NEWAFRAAD.dbo.MilitaryManagementOfficers ADD RemainingOccasionalDaysCount int NULL;
ALTER TABLE NEWAFRAAD.dbo.MilitaryManagementOfficers ADD RemainingAnnualDaysCount int NULL;


INSERT INTO NEWAFRAAD.dbo.EnrollersCertificators
( Name)
VALUES( N'السيد / قائد القوات');
INSERT INTO NEWAFRAAD.dbo.EnrollersCertificators
( Name)
VALUES( N'مكتب السيد / قائد القوات');
INSERT INTO NEWAFRAAD.dbo.EnrollersCertificators
(Name)
VALUES(N'السيد / نائب القائد');
INSERT INTO NEWAFRAAD.dbo.EnrollersCertificators
(Name)
VALUES( N'السيد / رئيس الأركان');
INSERT INTO NEWAFRAAD.dbo.EnrollersCertificators
( Name)
VALUES( N'السيد / رئيس الشعبة');
INSERT INTO NEWAFRAAD.dbo.EnrollersCertificators
( Name)
VALUES(N'السيد / نائب رئيس الشعبة');
INSERT INTO NEWAFRAAD.dbo.EnrollersCertificators
( Name)
VALUES(N'السيد / رئيس فرع الأفراد');


ALTER TABLE NEWAFRAAD.dbo.Followers ADD DegreeOfImportance int NULL;
ALTER TABLE NEWAFRAAD.dbo.Followers ADD DemandedJob nvarchar(50) NULL;

ALTER TABLE NEWAFRAAD.dbo.Followers DROP COLUMN DegreeOfImportance;
ALTER TABLE NEWAFRAAD.dbo.Followers ADD DegreeOfImportance nvarchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.Accidents ADD UnitID int NULL;

ALTER TABLE NEWAFRAAD.dbo.Followers ADD Exclusion bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Followers ADD ExclusionNotes nvarchar(300) NULL;



