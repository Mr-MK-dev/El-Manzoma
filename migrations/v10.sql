ALTER TABLE NEWAFRAAD.dbo.Fittings ADD Notes varchar(100) NULL;
ALTER TABLE NEWAFRAAD.dbo.Fittings ADD WeightedAt date NOT NULL;
ALTER TABLE NEWAFRAAD.dbo.Fittings ADD Excluded bit NULL;
INSERT INTO NewAFRAAD.dbo.Unit (UnitID,Unit,Directionforunit,SupplyLayer,[ordering],DirectionforFeaat,General_Direction,OrderingFeaat,TaabeaaCode,DirectionForSM,tamrkoz,statue,FollowedWeaponID,CommandAreasID,FollowingAreasID,PatternID,PackagingCode,StatisticsCode,Formation,Moratab,Siasa,SoldiersCompletenessPercentage,RatebsCompletenessPercentage,direction,OrderNo,OrderDate) VALUES
	 (1000,N'فرع التحريات/إدارة الشرطة',N'مركزى',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO NewAFRAAD.dbo.Unit (UnitID,Unit,Directionforunit,SupplyLayer,[ordering],DirectionforFeaat,General_Direction,OrderingFeaat,TaabeaaCode,DirectionForSM,tamrkoz,statue,FollowedWeaponID,CommandAreasID,FollowingAreasID,PatternID,PackagingCode,StatisticsCode,Formation,Moratab,Siasa,SoldiersCompletenessPercentage,RatebsCompletenessPercentage,direction,OrderNo,OrderDate) VALUES
	 (1001,N'قسم أمن / القيادة الإستراتيجية',N'مركزى',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT into EffectSituationStates  (Situation) Select Situation From SituationStates 