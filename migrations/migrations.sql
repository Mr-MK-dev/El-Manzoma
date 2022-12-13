ALTER TABLE NewAFRAAD.dbo.Followers ADD tripleNo varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ADD Name varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Moving ADD TotalSpecified int NULL;
ALTER TABLE NewAFRAAD.dbo.Recommendations ADD tripleNo varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Recommendations ADD Name varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ADD ServiceType varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ADD GHA varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ADD DriverLevel varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ADD Treatment varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ALTER COLUMN ServiceType varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ALTER COLUMN DriverLevel varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ALTER COLUMN Treatment varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ALTER COLUMN tripleNo varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ALTER COLUMN Name varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Recommendations ALTER COLUMN Name varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Users_ ALTER COLUMN [section] text COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL;
INSERT INTO NewAFRAAD.dbo.Users_ (username,password,[Role],RealName,[Degree],[section],DateAdded,isVisible,CanUnfollow,CanAddFollowup) VALUES
	 (N'x',N'x',2,N'x',N'x',N'sections.0.connected_devices,sections.0.edit_users,sections.2.tmam_elwosol,sections.2.effects,sections.2.tmam_elthr7el,sections.2.tmam_eltasgel,sections.2.distributed_suggest,sections.2.soliders_brothers,sections.2.dalies,sections.2.recommandations,sections.2.malaheq_suggest',N'2022-01-30 08:38:59.371 +00:00',1,0,0);
EXEC NewAFRAAD.sys.sp_rename N'NewAFRAAD.dbo.Rateb.KnowLevel' , N'KnowledgeLevel', 'COLUMN';
ALTER TABLE NewAFRAAD.dbo.Rateb ALTER COLUMN SupplyingRigion nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL;

--  changed FollowingRigion table name to FollowingRigion_

INSERT INTO NEWAFRAAD.dbo.FollowingRigion (FollowRigionName) VALUES
	 (N'دار الزمالك'),
	 (N'فندق ح ح'),
	 (N'شعبة عمليات'),
	 (N'مكتب الأمن'),
	 (N'ورشة اللنشات'),
	 (N'فرع القضاء'),
	 (N'فرع المتابعة'),
	 (N'شعبة التنظيم'),
	 (N'ك المقر'),
	 (N'فرع السجلات');
INSERT INTO NEWAFRAAD.dbo.FollowingRigion (FollowRigionName) VALUES
	 (N'منفذ كوبرى القبة'),
	 (N'مكتب نائب القائد'),
	 (N'مكتب القائد'),
	 (N'معسكر مشتروات دراو'),
	 (N'مكتب رئيس الأركان'),
	 (N'استاد الماكس'),
	 (N'فرع الشؤون المعنوية'),
	 (N'فرع الإتصال البحرى'),
	 (N'شعبة الإمداد'),
	 (N'فرع النظم');
INSERT INTO NEWAFRAAD.dbo.FollowingRigion (FollowRigionName) VALUES
	 (N'مركز تدريب'),
	 (N'فرع المركبات'),
	 (N'حملة التشوين'),
	 (N'نادى القبة'),
	 (N'ورشة النجارة'),
	 (N'الفرع المالى'),
	 (N'نادى الرمل'),
	 (N'معهد ح ح'),
	 (N'الملحقين من وإلى الوحدات'),
	 (N'جهاز الرياضة / هيئة تدريب');
INSERT INTO NEWAFRAAD.dbo.FollowingRigion (FollowRigionName) VALUES
	 (N'مناديب التجنيد'),
	 (N'منفذ بيع الجبل الأصفر'),
	 (N'قيادة قوات شعب وأفرع'),
	 (N'مأمورية خارج السلاح'),
	 (N'الوفاء و الأمل'),
	 (N'دار اليشسنيشس');

ALTER TABLE NEWAFRAAD.dbo.followersolider ADD isEnrolled bit NULL;
ALTER TABLE NEWAFRAAD.dbo.Followerrateb ADD isEnrolled bit NULL;
UPDATE NEWAFRAAD.dbo.followersolider
SET isEnrolled=1
UPDATE NEWAFRAAD.dbo.Followerrateb
SET isEnrolled=1
EXEC NEWAFRAAD.sys.sp_rename N'NEWAFRAAD.dbo.MkzanMohab', N'inventoryLevelup', 'OBJECT';
ALTER TABLE NewAFRAAD.dbo.Soldier ALTER COLUMN IndexNo nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.TravalTable DROP CONSTRAINT PK_TravalTable;
ALTER TABLE NewAFRAAD.dbo.Users_ ADD isAdmin bit DEFAULT 0 NULL;

ALTER TABLE NEWAFRAAD.dbo.Users_ ALTER COLUMN [section] nvarchar(3000) COLLATE Arabic_CI_AS NOT NULL;
UPDATE NewAFRAAD.dbo.SMGeneral
SET Rotaba_Code= N'جندي'
WHERE Rotaba_Code like N'%جندى%';
