ALTER TABLE NEWAFRAAD.dbo.Unit ADD SectorID int NULL;
INSERT into Sectors  (Name , State)  Select DISTINCT DirectionforFeaat as Name , 1 as State  from Unit  where Unit.DirectionforFeaat is not NULL  
UPDATE Unit set SectorID = Sectors.ID_KEY  from Sectors where  Sectors.Name = Unit .DirectionforFeaat 