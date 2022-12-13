ALTER TABLE NEWAFRAAD.dbo.GeneralRequests ADD spentAmount nvarchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Wives ADD SocialState nvarchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.DepartmentsInternalFollow DROP COLUMN [date];

ALTER TABLE NEWAFRAAD.dbo.DepartmentsInternalFollow ADD EndDate date NULL;

ALTER TABLE NEWAFRAAD.dbo.InjuredHospitals ADD EntryDate date NULL;
ALTER TABLE NEWAFRAAD.dbo.InjuredHospitals ADD LeaveDate date NULL;
