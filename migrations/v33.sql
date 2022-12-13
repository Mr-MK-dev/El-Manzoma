ALTER TABLE NEWAFRAAD.dbo.Unit ADD hasPackaging bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD isIllegal bit NULL;
ALTER TABLE NEWAFRAAD.dbo.followersolider  ADD isIllegal bit NULL;
ALTER TABLE NEWAFRAAD.dbo.PackagePlan ADD isDateFilled bit NULL;


ALTER TABLE NewAFRAAD.dbo.MartyrsAndInjured ADD IncidentSummary varchar(1000) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjured ADD PhoneNumber varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjured ADD NationalID varchar(100) NULL;

ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjured ADD InjuredStatusDescription varchar(1000) NULL;
ALTER TABLE NEWAFRAAD.dbo.MartyrsAndInjured ADD MilitaryStatus varchar(1000) NULL;

ALTER TABLE NewAFRAAD.dbo.MartyrsAndInjured ALTER COLUMN DisabilityRatio nvarchar(100) NULL;
