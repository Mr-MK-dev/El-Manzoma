let getSoldierData = function(pages) {
  let conscripte = {},
    page1 = pages[0].content,
    page2 = pages[1].content,
    page3 = pages[2].content, // Classes missed
    page4 = pages[3].content,
    page5 = pages[4].content;
  conscripte.mostRelivant = {};
  conscripte.licences = [];
  conscripte.licence1 = {};
  conscripte.licence2 = {};
  conscripte.ta3be2as = [];
  page1.forEach((straya, i) => {
    // Main Details
    let str = straya.str,
      str1a = page1[i + 1] ? page1[i + 1].str : "",
      str2a = page1[i + 2] ? page1[i + 2].str : "",
      str1b = page1[i - 1] ? page1[i - 1].str : "",
      str2b = page1[i - 2] ? page1[i - 2].str : "",
      str3b = page1[i - 3] ? page1[i - 3].str : "";
    if (str == "الرقم العسكري") {
      // conscripte.militaryId = str1b;
      conscripte.militaryId = getNumberFromString(str1b);
    }
    if (str == "الرقم الثلاثي") {
      conscripte.tripartiteNumber =
        str1b == "بيانات تجنيدية" ? "" : `${str1b}-${str2b}-${str3b}`;
    }
    if (str == "منطقة التجنيد") {
      conscripte.area = str1b == "القوات" ? "" : str1b;
    }
    if (str == "القوات") {
      conscripte.powers = str1b == "الرقم العسكري" ? "" : str1b;
    }
    if (str == "التمركز") {
      conscripte.zone = str1b == "نوع التجنيد" ? "" : str1b;
    }
    if (str == "نوع التجنيد") {
      conscripte.additionalYear = str1b == "منطقة التجنيد" ? "" : str1b;
    }
    if (str == "الحالة") {
      // FullName
      conscripte.fullName = str2a == "الأسم" ? str1a : str1a + " " + str2a;
      conscripte.dutyState = str1b == "التمركز" ? "" : str1b;
    }
    if (str == "التخصص") {
      conscripte.jobInArmy = str1b == "المؤهل" ? "" : str1b;
    }
    if (str == "المؤهل") {
      conscripte.qualification = str1b == "الأسم" ? "" : str1b;
    }
    if (str == "تاريخ الإلتحاق بالخدمة") {
      conscripte.webConscriptionDate = str1b == "السلاح" ? "" : str1b;
    }
    if (str == "السلاح") {
      conscripte.force = str1b == "التخصص" ? "" : str1b;
    }
    if (str == "رقم الرخصة الاولى") {
      conscripte.licence1.number = str1b == "تاريخ الرخصة الاولى" ? "" : str1b;
    }
    if (str == "تاريخ الرخصة الاولى") {
      conscripte.licence1.date = str1b == "تاريخ الإلتحاق بالخدمة" ? "" : str1b;
    }
    if (str == "قرار التخفيض") {
      conscripte.reductionState =
        str1b == "رقم الرخصة الثانية"
          ? ""
          : `${str2b == "رقم الرخصة الثانية" ? "" : str2b} ${str1b}`;
    }
    if (str == "رقم الرخصة الثانية") {
      conscripte.licence2.number = str1b == "تاريخ الرخصة الثانية" ? "" : str1b;
    }
    if (str == "تاريخ الرخصة الثانية") {
      conscripte.licence2.date = str1b == "رقم الرخصة الاولى" ? "" : str1b;
    }
    if (str == "تاريخ اخر كوموسيون") {
      conscripte.webLastComsionDate = str1b == "المستوي الطبي" ? "" : str1b;
      let splitter = conscripte.webLastComsionDate
        ? conscripte.webLastComsionDate.split("/")
        : null;
      conscripte.webLastComsionDate = splitter
        ? splitter[0] + "/" + splitter[1] + "/" + splitter[2].slice(0, 2)
        : conscripte.webLastComsionDate;
    }
    if (str == "المستوي الطبي") {
      conscripte.medicalLevel = str1b == "المستوي الثقافي" ? "" : str1b;
    }
    if (str == "المستوي الثقافي") {
      conscripte.caltureLevel = str1b == "قرار التخفيض" ? "" : str1b;
    }
    if (str == "بيانات شخصية") {
      if (
        page1[i - 1].str &&
        page1[i - 1].str.length > 0 &&
        page1[i - 1].str !== "نوع التعبئة"
      ) {
        conscripte.ta3be2as.push({
          type: page1[i - 1].str,
          number: page1[i - 2].str,
          office: page1[i - 3].str,
          date: page1[i - 4].str,
          phone: page1[i - 5].str,
          militaryId: conscripte.militaryId
        });
      }
      if (
        page1[i - 6].str &&
        page1[i - 6].str.length > 0 &&
        ![page1[i - 6].str, page1[i - 5].str].includes("نوع التعبئة")
      ) {
        conscripte.ta3be2as.push({
          type: page1[i - 6].str,
          number: page1[i - 7].str,
          office: page1[i - 8].str,
          date: page1[i - 9].str,
          phone: page1[i - 10].str,
          militaryId: conscripte.militaryId
        });
      }
    }
    if (str == "المؤهل المدني") {
      let cq = str1b == "بيانات شخصية" ? "" : str1b,
        hasGroup = cq.includes("(") && cq.includes(")");
      conscripte.civilQualificationGroup = hasGroup
        ? cq.substring(0, cq.lastIndexOf(")")).trim()
        : "";
      conscripte.civilQualification = hasGroup
        ? cq.substring(cq.lastIndexOf(")") + 1, cq.length - 1).trim()
        : cq;
    }
    if (str == "الديانة") {
      conscripte.religion = str1b == "فصيلة الدم" ? "" : str1b;
    }
    if (str == "فصيلة الدم") {
      conscripte.bloodType = str1b == "المؤهل المدني" ? "" : str1b;
    }
    if (str == "الحالة الإجتماعية") {
      conscripte.maritalStatus = str1b == "تاريخ الميلاد" ? "" : str1b;
    }
    if (str == "تاريخ الميلاد") {
      conscripte.birthDate = str1b == "الديانة" ? "" : str1b;
    }
    if (str == "المهنة قبل التجنيد") {
      conscripte.jobBeforeConscription = str1b == "التليفون" ? "" : str1b;
    }
    if (str == "التليفون") {
      conscripte.phone = str1b == "الحالة الإجتماعية" ? "" : str1b;
    }
    if (str == "القسم / المركز") {
      // Governorate - Birth Side
      conscripte.governorateBirthSide = str1a == "محافظة" ? "" : str1a;
      conscripte.qesm = str1b == "الحي/ البلد" ? "" : str1b;
      if (conscripte.qesm && conscripte.qesm.length > 0) {
        conscripte.qesm =
          str2b == "الحي/ البلد"
            ? conscripte.qesm
            : str2b + " " + conscripte.qesm;
      }
    }
    if (str == "الحي/ البلد") {
      conscripte.region = str1b == "جهة الميلاد" ? "" : str1b;
      if (conscripte.region && conscripte.region.length > 0) {
        conscripte.region =
          str2b == "جهة الميلاد"
            ? conscripte.region
            : str2b + " " + conscripte.region;
      }
    }
    if (str == "سجل مدني") {
      conscripte.governorateNationalCardSide =
        str1a == "جهة الميلاد" ? "" : str1a;
      conscripte.segelMadany = str1b == "الرقم القومي" ? "" : str1b;
    }
    if (str == "الرقم القومي") {
      conscripte.nationalId = str1b == "بيانات بطاقة الرقم القومي" ? "" : str1b;
    }
    if (str == "العنوان" && str1a == "بيانات أقرب الأقارب") {
      conscripte.address = str1b == "محافظة" ? "" : str1b;
    }
    if (str == "درجة القرابة") {
      conscripte.mostRelivant.degree = str1b == "الأسم" ? "" : str1b;
      conscripte.mostRelivant.address = str1a == "العنوان" ? "" : str1a;
      // conscripte.mostRelivant.degree = "أم";
      // conscripte.mostRelivant.address = "حي راشد سوهاج";
    }
    if (str == "بيانات أقرب الأقارب") {
      conscripte.mostRelivant.name = str1a == "الأسم" ? "" : str1a;
      // conscripte.mostRelivant.name = "ابن أبوتريكة";
    }
    if (str == "رقم التليفون") {
      if (str1b !== "تاريخ اخر كوموسيون") {
        conscripte.mostRelivant.phone = str1b == "الأسم" ? "" : str1b;
        // conscripte.mostRelivant.phone = "0123548794156";
      }
    }
    if (str.includes("رتــبة واســـم")) {
      let unitLeader = str
        .replace("رتــبة واســـم :", "")
        .trim()
        .split("/");
      conscripte.currentUnitLeader = {
        degree: unitLeader[0].trim(),
        name: unitLeader[1].trim()
      };
    }
  });
  if (
    conscripte.licence1 &&
    conscripte.licence1.number &&
    conscripte.licence1.number.length > 0
  ) {
    conscripte.licences.push({
      ...conscripte.licence1,
      type: "الرخصة الأولى",
      militaryId: conscripte.militaryId
    });
  }
  if (
    conscripte.licence2 &&
    conscripte.licence2.number &&
    conscripte.licence2.number.length > 0
  ) {
    conscripte.licences.push({
      ...conscripte.licence2,
      type: "الرخصة الثانية",
      militaryId: conscripte.militaryId
    });
  }
  // Get Promotions from Page2 without need to loop
  conscripte.promotions = [];
  let page1Is1Page = true;
  if (page2.filter(f => f.str.includes("القسم الأول")).length == 0) {
    page1Is1Page = false;
  }
  let page2ToUse = page1Is1Page ? page2 : page3;
  let promotions = page2ToUse.filter(f => ["ترقى", "عزل"].includes(f.str));
  promotions.forEach((promo, i) => {
    // Get promotion details
    let data = page2ToUse.filter(f => f.y == promo.y);
    conscripte.promotions.push({
      militaryId: conscripte.militaryId,
      type: promo.str,
      degree: data[data.length - 2] ? data[data.length - 2].str : "",
      date: data[data.length - 3] ? data[data.length - 3].str : "",
      orderNumber:
        data[data.length - 4] &&
        !data[data.length - 4].str.includes("/") &&
        !data[data.length - 4].str.includes("ترقى") &&
        !data[data.length - 4].str.includes("عزل")
          ? data[data.length - 4].str
          : ""
    });
  });
  conscripte.units = [];
  page2ToUse.forEach((straya, i) => {
    // Promotions && Units
    let str = straya.str,
      str1b = page2ToUse[i - 1] ? page2ToUse[i - 1].str : "";
    // Units
    if (webUnits.includes(getNumberFromString(str)) || webUnits.includes(str)) {
      conscripte.units.push(getNumberFromString(str));
    }
    if (str.includes("التــــــوقيـــــع")) {
      if (
        !conscripte.units.includes(getNumberFromString(str1b)) &&
        str1b.length > 0 &&
        str1b !== "الوحدة"
      ) {
        conscripte.units.push(getNumberFromString(str1b));
      }
    }
  });
  let page3ToUse = page1Is1Page ? page3 : page4;
  page3ToUse.forEach((straya, i) => {
    // Educational Classes && Termination Data
    let str = straya.str,
      str1b = page3ToUse[i - 1] ? page3ToUse[i - 1].str : "",
      str2b = page3ToUse[i - 2] ? page3ToUse[i - 2].str : "",
      str3b = page3ToUse[i - 3] ? page3ToUse[i - 3].str : "";
    // Termination Data
    if (str == "تاريخ إنهاء الخدمة") {
      conscripte.webDemobilizationDate =
        str1b == "تاريخ التجنيد" ? "" : `${str1b}-${str2b}-${str3b}`;
    }
    if (str == "مدة الخدمة") {
      conscripte.webServicePeriod =
        str1b == "تاريخ إنهاء الخدمة" ? "" : `${str1b}-${str2b}-${str3b}`;
    }
    if (str == "المدة الفاقدة") {
      conscripte.webLostPeriod =
        str1b == "مدة الخدمة" ? "" : `${str1b}-${str2b}-${str3b}`;
    }
    if (str == "صافي مدة الخدمة") {
      conscripte.webClearServicePeriod =
        str1b == "المدة الفاقدة" ? "" : `${str1b}-${str2b}-${str3b}`;
    }
    if (str == "درجة الأخلاق") {
      conscripte.webMoralsDegree = str1b == "صافي مدة الخدمة" ? "" : str1b;
    }
    // Educational Classes
    if (
      str.includes("القسم الرابع") &&
      str1b !== "" &&
      str1b !== "اسم الفرقة / الدورة"
    ) {
      // has classes
    }
  });
  let page4Index = page1Is1Page ? 3 : 4;
  let penPages = function(pages) {
      let finish = false,
        pageIndexes = [page4Index];
      for (let i = page4Index + 1; i < 10; i++) {
        // 10 Here because i don't think a conscripte can has more than 10 pages of penalities
        if (!finish) {
          if (
            pages[i].content.filter(f => f.str.includes("القسم السادس"))
              .length == 1
          ) {
            finish = true;
          } else {
            pageIndexes.push(i);
          }
        }
      }
      return pageIndexes;
    },
    pagesToUse = penPages(pages);
  conscripte.penalities = [];
  pagesToUse.forEach(pageIndex => {
    let currentPage = pages[pageIndex].content;
    let penaltiesNumbers = currentPage.filter(f =>
        arabicNumbers.includes(f.str)
      ),
      length =
        penaltiesNumbers && penaltiesNumbers.length > 0
          ? penaltiesNumbers.length
          : 0,
      lastNumber =
        penaltiesNumbers && penaltiesNumbers.length > 0
          ? penaltiesNumbers[length - 1].str
          : 0,
      lastNumberInInteger = getNumberFromString(lastNumber);
    penaltiesNumbers.forEach(pn => {
      let numberInInteger = getNumberFromString(pn.str);
      if (numberInInteger <= length) {
        let pIndex = currentPage.findIndex(f => f.str == pn.str);
        let dateIsNear = currentPage[pIndex - 2].str.includes("-");
        let myLine = currentPage.filter(f => f.y == pn.y - 1);
        let period = myLine[myLine.length - 2].str;
        let periodNumbers = getNumberFromString(period);
        let periodInDays = "";
        if (periodNumbers.includes("يوم")) {
          periodInDays = `${Number(periodNumbers.replace("يوم", "").trim())}`;
        }
        if (periodNumbers.includes("شهر") || periodNumbers.includes("شهور")) {
          periodInDays = `${Number(
            periodNumbers
              .replace("شهر", "")
              .replace("شهور", "")
              .trim()
          ) * 30}`;
        }
        if (
          periodNumbers.includes("سنة") ||
          periodNumbers.includes("سنه") ||
          periodNumbers.includes("سنين")
        ) {
          periodInDays = `${Number(
            periodNumbers
              .replace("سنة", "")
              .replace("سنه", "")
              .replace("سنين", "")
              .trim()
          ) *
            12 *
            30}`;
        }
        let periodIndex = currentPage.findIndex(
          f => f.str == period && f.y == pn.y - 1
        );
        let crimeText = currentPage
            .slice(periodIndex + 1, dateIsNear ? pIndex - 1 : pIndex - 2)
            .map(f => f.str)
            .join(" "),
          crimeFromDate =
            crimeText.includes("من") && crimeText.includes("الي")
              ? crimeText
                  .substring(
                    crimeText.lastIndexOf("من") + 2,
                    crimeText.lastIndexOf("الي") - 1
                  )
                  .split(" ")
                  .join("")
                  .trim()
              : "",
          crimeToDate =
            crimeText.includes("من") && crimeText.includes("الي")
              ? crimeText
                  .substring(
                    crimeText.lastIndexOf("الي") + 3,
                    crimeText.length - 1
                  )
                  .split(" ")
                  .join("")
                  .trim()
              : "";
        let ordererIsNear =
          currentPage[periodIndex - 2] &&
          (currentPage[periodIndex - 2].str.includes("حبس") ||
            currentPage[periodIndex - 2].str.includes("السجن") ||
            currentPage[periodIndex - 2].str.includes("حجز"));
        let penalty = "",
          from = "",
          to = "",
          orderNumber = "",
          orderDate = "",
          typeIndex = currentPage.findIndex(
            f =>
              f.y == pn.y - 1 &&
              (f.str.includes("عقوبة") || f.str.includes("محكمة"))
          ),
          type =
            currentPage[typeIndex].str + " " + currentPage[typeIndex + 1].str,
          isCourt = currentPage[typeIndex].str.includes("محكمة"),
          courtDate = "",
          courtPlace = "";
        if (
          isCourt &&
          currentPage[typeIndex - 1].str !== "م" &&
          !arabicNumbers.includes(currentPage[typeIndex - 1].str) &&
          currentPage[typeIndex - 2].str !== "م" &&
          !arabicNumbers.includes(currentPage[typeIndex - 2].str)
        ) {
          if (currentPage[typeIndex - 1].str.length > 5) {
            // Single line date
            courtDate = currentPage[typeIndex - 1].str;
            if (
              currentPage[typeIndex - 2].str !== "م" &&
              !arabicNumbers.includes(currentPage[typeIndex - 2].str)
            ) {
              if (
                currentPage[typeIndex - 3].str !== "م" &&
                !arabicNumbers.includes(currentPage[typeIndex - 3].str)
              ) {
                // Multi line
                courtPlace =
                  currentPage[typeIndex - 3].str +
                  " " +
                  currentPage[typeIndex - 2].str;
              } else {
                // Single line
                courtPlace = currentPage[typeIndex - 2].str;
              }
            }
          } else {
            courtDate =
              currentPage[typeIndex - 2].str +
              "" +
              currentPage[typeIndex - 1].str;
            if (
              currentPage[typeIndex - 3].str !== "م" &&
              !arabicNumbers.includes(currentPage[typeIndex - 3].str)
            ) {
              if (
                currentPage[typeIndex - 4].str !== "م" &&
                !arabicNumbers.includes(currentPage[typeIndex - 4].str)
              ) {
                // Multi line
                courtPlace =
                  currentPage[typeIndex - 4].str +
                  " " +
                  currentPage[typeIndex - 3].str;
              } else {
                // Single line
                courtPlace = currentPage[typeIndex - 3].str;
              }
            }
          }
        }
        if (ordererIsNear) {
          if (!currentPage[periodIndex - 3].str.includes("القطع")) {
            // Single line penality
            penalty = currentPage[periodIndex - 2].str;
            if (currentPage[periodIndex - 3].str.length > 5) {
              from = currentPage[periodIndex - 3].str;
              if (currentPage[periodIndex - 4].str.length == 12) {
                // one line date
                to = currentPage[periodIndex - 4].str;
                orderNumber = currentPage[periodIndex - 5].str;
              } else {
                to =
                  currentPage[periodIndex - 5].str +
                  "" +
                  currentPage[periodIndex - 4].str;
                orderNumber = currentPage[periodIndex - 6].str;
              }
            } else {
              from =
                currentPage[periodIndex - 4].str +
                "" +
                currentPage[periodIndex - 3].str;
              if (currentPage[periodIndex - 5].str.length == 12) {
                // one line date
                to = currentPage[periodIndex - 5].str;
                orderNumber = currentPage[periodIndex - 6].str;
              } else {
                to =
                  currentPage[periodIndex - 6].str +
                  "" +
                  currentPage[periodIndex - 5].str;
                orderNumber = currentPage[periodIndex - 7].str;
              }
            }
          } else {
            penalty =
              currentPage[periodIndex - 3].str +
              " " +
              currentPage[periodIndex - 2].str;
            if (currentPage[periodIndex - 4].str.length > 5) {
              from = currentPage[periodIndex - 4].str;
              if (currentPage[periodIndex - 5].str.length == 12) {
                // one line date
                to = currentPage[periodIndex - 5].str;
                orderNumber = currentPage[periodIndex - 6].str;
              } else {
                to =
                  currentPage[periodIndex - 6].str +
                  "" +
                  currentPage[periodIndex - 5].str;
                orderNumber = currentPage[periodIndex - 7].str;
              }
            } else {
              from =
                currentPage[periodIndex - 5].str +
                "" +
                currentPage[periodIndex - 4].str;
              if (currentPage[periodIndex - 6].str.length == 12) {
                // one line date
                to = currentPage[periodIndex - 6].str;
                orderNumber = currentPage[periodIndex - 7].str;
              } else {
                to =
                  currentPage[periodIndex - 7].str +
                  "" +
                  currentPage[periodIndex - 6].str;
                orderNumber = currentPage[periodIndex - 8].str;
              }
            }
          }
        } else {
          if (
            currentPage[periodIndex - 4] &&
            currentPage[periodIndex - 4].str.includes("القطع")
          ) {
            penalty = currentPage[periodIndex - 3].str;
            if (currentPage[periodIndex - 4].str.length > 5) {
              from = currentPage[periodIndex - 4].str;
              if (currentPage[periodIndex - 5].str.length == 12) {
                // one line date
                to = currentPage[periodIndex - 5].str;
                orderNumber = currentPage[periodIndex - 6].str;
              } else {
                to =
                  currentPage[periodIndex - 6].str +
                  "" +
                  currentPage[periodIndex - 5].str;
                orderNumber = currentPage[periodIndex - 7].str;
              }
            } else {
              from =
                currentPage[periodIndex - 5].str +
                "" +
                currentPage[periodIndex - 4].str;
              if (currentPage[periodIndex - 6].str.length == 12) {
                // one line date
                to = currentPage[periodIndex - 6].str;
                orderNumber = currentPage[periodIndex - 7].str;
              } else {
                to =
                  currentPage[periodIndex - 7].str +
                  "" +
                  currentPage[periodIndex - 6].str;
                orderNumber = currentPage[periodIndex - 8].str;
              }
            }
          } else {
            penalty = currentPage[periodIndex - 4]
              ? currentPage[periodIndex - 4].str +
                " " +
                currentPage[periodIndex - 3].str
              : "";
            if (
              currentPage[periodIndex - 5] &&
              currentPage[periodIndex - 5].str.length > 5
            ) {
              from = currentPage[periodIndex - 5].str;
              if (currentPage[periodIndex - 6].str.length == 12) {
                // one line date
                to = currentPage[periodIndex - 6].str;
                orderNumber = currentPage[periodIndex - 7].str;
              } else {
                to =
                  currentPage[periodIndex - 7].str +
                  "" +
                  currentPage[periodIndex - 6].str;
                orderNumber = currentPage[periodIndex - 8].str;
              }
            } else {
              from = currentPage[periodIndex - 6]
                ? currentPage[periodIndex - 6].str +
                  "" +
                  currentPage[periodIndex - 5].str
                : "";
              if (
                currentPage[periodIndex - 7] &&
                currentPage[periodIndex - 7].str.length == 12
              ) {
                // one line date
                to = currentPage[periodIndex - 7].str;
                orderNumber = currentPage[periodIndex - 8].str;
              } else {
                to = currentPage[periodIndex - 8]
                  ? currentPage[periodIndex - 8].str +
                    "" +
                    currentPage[periodIndex - 7].str
                  : "";
                orderNumber = currentPage[periodIndex - 9]
                  ? currentPage[periodIndex - 9].str
                  : "";
              }
            }
          }
        }
        let kind = penalty.includes("حبس")
            ? "حبس"
            : penalty.includes("حجز")
            ? "حجز"
            : penalty.includes("السجن")
            ? "السجن"
            : penalty,
          orderer = ordererIsNear
            ? currentPage[periodIndex - 1].str
            : currentPage[periodIndex - 2]
            ? currentPage[periodIndex - 2].str +
              " " +
              currentPage[periodIndex - 1].str
            : "";
        let pen = {
          militaryId: conscripte.militaryId,
          date: dateIsNear
            ? currentPage[pIndex - 1].str
            : `${currentPage[pIndex - 2].str}${currentPage[pIndex - 1].str}`,
          crimeText,
          crimeFromDate,
          crimeToDate,
          periodInDays,
          orderer: null,
          withSalaryCut: penalty.includes("مع") && penalty.includes("القطع"),
          fromDate: from,
          toDate: to,
          type: null,
          kind: null,
          orderNumber,
          orderDate,
          isCourt,
          courtDate,
          courtPlace: null
        };
        if (orderer && orderer.length > 0 ? orderer : null) {
          pen.orderer = orderer;
        }
        if (courtPlace && courtPlace.length > 0 ? courtPlace : null) {
          pen.courtPlace = courtPlace;
        }
        if (type && type.length > 0 ? type : null) {
          pen.type = type;
        }
        if (kind && kind.length > 0 ? kind : null) {
          pen.kind = kind;
        }
        conscripte.penalities.push(pen);
      }
    });
  });

  let sectionSeven = pages[pagesToUse[pagesToUse.length - 1] + 1].content;
  conscripte.webNotes = [];
  sectionSeven.forEach((straya, i) => {
    // Wars && Notes
    let str = straya.str,
      str1b = sectionSeven[i - 1] ? sectionSeven[i - 1].str : "",
      str2b = sectionSeven[i - 2] ? sectionSeven[i - 2].str : "";
    if (str.includes("القسم السابع")) {
      if (str1b !== "م" && str1b !== "") {
        // Has wars
      }
      let sectionSevenTitleY = straya.y;
      let notesIndexes = sectionSeven.filter(
        f => arabicNumbers.includes(f.str) && f.y > sectionSevenTitleY
      );
      notesIndexes.forEach(noteIndex => {
        let note = sectionSeven.filter(
          f => f.y == noteIndex.y && f.str !== noteIndex.str
        )[0];
        conscripte.webNotes.push(note.str);
        let indexBefore = sectionSeven.findIndex(f => f.str == note.str) - 1;
        if (
          !arabicNumbers.includes(sectionSeven[indexBefore].str) &&
          sectionSeven[indexBefore].str !== "م" &&
          sectionSeven[indexBefore].str !== "تاريخ الغياب" &&
          sectionSeven[indexBefore].str.length > 0
        ) {
          conscripte.webNotes.push(sectionSeven[indexBefore - 1].str);
        }
      });
    }
    if (
      str.includes("محو") ||
      str.includes("هذا الفرد") ||
      str.includes("مصدقة محو امية")
    ) {
      conscripte.webNotes.push(str);
    }
  });
  conscripte.webNotes = conscripte.webNotes.filter(f => f.length > 0);
  // if (
  //   pages[pagesToUse[pagesToUse.length - 1] + 2] &&
  //   pages[pagesToUse[pagesToUse.length - 1] + 2].content &&
  //   pages[pagesToUse[pagesToUse.length - 1] + 2].content.length > 0
  // ) {
  //   let currentPage = pages[pagesToUse[pagesToUse.length - 1] + 2].content;
  //   // Has additional page
  //   if (currentPage.filter(f => f.str.includes("قرار تخفيض"))) {
  //     //
  //   }
  // }
  return conscripte;
};
