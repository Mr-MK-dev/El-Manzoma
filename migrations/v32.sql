ALTER TABLE NEWAFRAAD.dbo.userTracking ADD beforeChange nvarchar(255) NULL;
ALTER TABLE NEWAFRAAD.dbo.Users_ ADD avatar varchar(MAX) NULL;


INSERT INTO NEWAFRAAD.dbo.SystemRules
([Key], Value)
VALUES('TransferList', 1);

ALTER TABLE NEWAFRAAD.dbo.TransferIntelligence ADD [Type] varchar(100) NULL;
