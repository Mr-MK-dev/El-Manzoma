let {
  is4CharYear,
  fixDateSpaces,
  fixConscripteNumbers,
  getConscriptionPeriodText,
  fixPeriodToDays,
  getNumberFromString,
  onlyNumbers
} = require("./funcs");

let { webUnits, arabicNumbers } = require("./vars");

module.exports = function (npages) {
  let pages = [];
  npages.forEach((page, i) => {
    page.content.forEach(c => {
      c.pageNumber = i;
    });
    pages = [...pages, ...page.content];
  });
  let // البيانات الساسية
    page1_a = pages.findIndex(p => p.str.includes("السجل الاساسي")),
    // الترقي والعزل
    page1_b = pages.findIndex(p => p.str.includes("القسم الأول")),
    // المراجعات العامة
    page2_b = pages.findIndex(p => p.str.includes("القسم الثاني")),
    // بيانات تكتب عند إنتهاء الخدمة
    page3_b = pages.findIndex(p => p.str.includes("القسم الثالث")),
    // الوحدات وجهات الخدمة
    page4_b = pages.findIndex(p => p.str.includes("القسم الرابع")),
    // التأهيل العلمي والعسكري - والفرق التعليمية
    page5_b = pages.findIndex(p => p.str.includes("القسم الخامس")),
    // العقوبات
    page6_b = pages.findIndex(p => p.str.includes("القسم السادس")),
    // عقوبات الطالب
    page7_b = pages.findIndex(p => p.str.includes("القسم السادس مكرر")),
    // المعارك الحربية
    page8_b = pages.findIndex(p => p.str.includes("القسم السابع")),
    // بيان تدرج الراتب
    page9_b = pages.findIndex(p => p.str.includes("القسم الثامن")),
    // الأجازات الخاصة
    page10_b = pages.findIndex(p => p.str.includes("القسم التاسع")),
    // البيانات الشخصية والإجتماعية والعائلية
    page11_b = pages.findIndex(p => p.str.includes("القسم العاشر")),
    // بيانات البطاقة العلاجية
    page12_b = pages.findIndex(p => p.str.includes("القسم الحادى عشر")),
    // ملاحظات عامة
    page13_b = pages.findIndex(p => p.str.includes("القسم الثاني عشر")),
    // ملخص تقارير الكفائة
    page14_b = pages.findIndex(p => p.str.includes("القسم الثالث عشر"));
  let conscripte = {},
    page1 = pages.slice(0, page1_b), // Section 0 [Main Info]
    page2 = pages.slice(page1_b, page2_b), // Section 1
    page3 = pages.slice(page2_b, page3_b), // Section 2
    page4 = pages.slice(page3_b, page4_b), // Section 3
    page5 = pages.slice(page4_b, page5_b), // Section 4
    page6 = pages.slice(page5_b, page6_b), // Section 5
    page7 = pages.slice(page6_b, page7_b), // Section 6
    page8 = pages.slice(page7_b, page8_b), // Section 6 repeated
    page9 = pages.slice(page8_b, page9_b), // Section 7
    page10 = pages.slice(page9_b, page10_b), // Section 8
    page11 = pages.slice(page10_b, page11_b), // Section 9
    page12 = pages.slice(page11_b, page12_b), // Section 10
    page13 = pages.slice(page12_b, page13_b), // Section 11
    page14 = pages.slice(page13_b, page14_b), // Section 12
    page15 = pages.slice(page14_b, pages.length); // Section 13
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
      str3a = page1[i + 3] ? page1[i + 3].str : "",
      str4a = page1[i + 4] ? page1[i + 4].str : "",
      str5a = page1[i + 5] ? page1[i + 5].str : "",
      str6a = page1[i + 6] ? page1[i + 6].str : "",
      str7a = page1[i + 7] ? page1[i + 7].str : "",
      str1b = page1[i - 1] ? page1[i - 1].str : "",
      str2b = page1[i - 2] ? page1[i - 2].str : "",
      str3b = page1[i - 3] ? page1[i - 3].str : "",
      str4b = page1[i - 4] ? page1[i - 4].str : "";
    if (str == "الرقم العسكرى") {
      // conscripte.militaryId = str1b;
      conscripte.militaryId = getNumberFromString(str1b);
    }
    if (str == "الرقم الثلاثى") {
      conscripte.tripartiteNumber =
        str1b == "منطقة تجنيد"
          ? ""
          : `${str1b ? str1b.replace(/\//g, "-") : ""}`;
      if (conscripte.tripartiteNumber) {
        conscripte.tripartiteNumber = conscripte.tripartiteNumber
          .split(" ")
          .join("")
          .trim();
      }
    }
    if (str == "منطقة تجنيد") {
      conscripte.area = str1b == "القوات" ? "" : str1b;
    }
    if (str == "القوات") {
      conscripte.powers = str1b;
    }
    if (str == "الاسم") {
      conscripte.fullName = str1b == "الرقم العسكرى" ? "" : str1b;
    }
    if (str == "المستوى الثقافى") {
      conscripte.caltureLevel = str1b == "الاسم" ? "" : str1b;
    }
    if (str == "المستوى الطبى") {
      conscripte.medicalLevel = str1b == "المستوى الثقافى" ? "" : str1b;
    }
    if (str == "بيانات شخصية") {
      conscripte.conscriptionDate = str1b;
      conscripte.webConscriptionDate = str1b;
      conscripte.force = str2b;
      conscripte.jobInArmy = str3b; // الواجب المدرب عليه
      conscripte.webServicePeriod = str4b; // Because it is always has a value
    }
    if (str == "المؤهل المدني") {
      let cq = str1b == "المهنه قبل التطوع" ? "" : str1b,
        hasGroup = cq.includes("(") && cq.includes(")");
      conscripte.civilQualificationGroup = hasGroup
        ? cq.substring(0, cq.lastIndexOf(")")).trim()
        : "";
      conscripte.civilQualification = hasGroup
        ? cq.substring(cq.lastIndexOf(")") + 1, cq.length - 1).trim()
        : cq;
    }
    if (str == "المهنه قبل التطوع") {
      conscripte.jobBeforeConscription = str1b == "بيانات شخصية" ? "" : str1b;
    }
    if (str == "الديانه") {
      conscripte.religion = str1b == "فصيله الدم" ? "" : str1b;
    }
    if (str == "فصيله الدم") {
      conscripte.bloodType = str1b == "المؤهل المدنى" ? "" : str1b;
    }
    if (str == "الجاله الإجتماعيه") {
      conscripte.maritalStatus = str1b == "النوع" ? "" : str1b;
    }
    if (str == "النوع") {
      conscripte.gender = str1b == "الديانه" ? "" : str1b; // Ask Moqadem
    }
    if (str == "تاريخ الميلاد" && str1b == "الحى/البلد") {
      // Governorate
      conscripte.governorateNationalCardSide = str1a;
      conscripte.segelMadany = str2a;
      conscripte.nationalId = str3a;
      conscripte.governorateBirthSide = str4a;
      conscripte.qesm = str5a;
      conscripte.region = str6a;
      if (str7a.replace("/", "").includes("/")) {
        conscripte.birthDate = page1[i + 7].str;
      }
    }
    if (str == "العنوان") {
      conscripte.address = str1b == "التليفون" ? "" : str1b;
    }
    if (str == "التليفون") {
      conscripte.phone = str1b == conscripte.birthDate ? "" : str1b;
    }
  });
  // Get Promotions from Page2 without need to loop
  conscripte.promotions = [];
  let page1Is1Page = true;
  let page2ToUse = page2;
  let promotions = page2ToUse.filter(
    f => arabicNumbers.includes(f.str)
    // f.str.includes("طالب") ||
    // f.str.includes("عـريف") ||
    // f.str.includes("رقيـب") ||
    // f.str.includes("رقيب") ||
    // f.str.includes("مساعد")
  );
  promotions.forEach((promoNumber, i) => {
    // Get promotion details
    let promoIndex = page2ToUse.findIndex(
      f => f.str == promoNumber.str && f.pageNumber == promoNumber.pageNumber
    ),
      promo = page2ToUse[promoIndex - 1],
      data = page2ToUse.filter(
        f => f.y == promo.y && f.pageNumber == promo.pageNumber
      ),
      notes =
        data[data.length - 5] &&
          data[data.length - 5].str &&
          data[data.length - 5].str.includes("/")
          ? data[data.length - 6].str
          : data[data.length - 4] &&
            data[data.length - 4].str &&
            data[data.length - 4].str.includes("/")
            ? data[data.length - 5].str
            : "";

    // Hamdy detect promo if by detecting the ID column by checking it has arabic number below 60 and back one index!.
    // sometimes the third column has number below 60
    if (promo.str.includes("/")) {
      return;
    }

    // don't push this promo it's a Date not a promo
    conscripte.promotions.push({
      militaryId: conscripte.militaryId,
      type: notes.includes("عزل") ? "عزل" : "ترقى", // TODO: Find a way to get this - [Done]
      degree: promo.str,
      date: data[data.length - 3] ? data[data.length - 3].str : "",
      orderNumber:
        data[data.length - 4] &&
          data[data.length - 4].str &&
          !data[data.length - 4].str.includes("/")
          ? data[data.length - 4].str
          : "",
      orderDate:
        data[data.length - 5] &&
          data[data.length - 5].str &&
          data[data.length - 5].str.includes("/")
          ? data[data.length - 5].str
          : data[data.length - 4] &&
            data[data.length - 4].str &&
            data[data.length - 4].str.includes("/")
            ? data[data.length - 4].str
            : ""
    });
  });
  page4.forEach((straya, i) => {
    let str = straya.str,
      str1a = page4[i + 1] ? page4[i + 1].str : "",
      str2a = page4[i + 2] ? page4[i + 2].str : "",
      str1b = page4[i - 1] ? page4[i - 1].str : "",
      str2b = page4[i - 2] ? page4[i - 2].str : "",
      str3b = page4[i - 3] ? page4[i - 3].str : "";
    if (str == "سنة") {
      // conscripte.conscriptionDate = str1b;
      conscripte.highSalaryPayingOutDate = str2b;
      conscripte.webDemobilizationDate =
        str3b == "تاريخ الإلتحاق بالخدمة" ? "" : str3b;
      if (
        conscripte.webDemobilizationDate &&
        conscripte.webDemobilizationDate.length > 0
      ) {
        conscripte.dutyState = "منتهى خدمته";
      } else {
        conscripte.dutyState = "بالخدمة";
      }
      // conscripte.stateId = str3b == "تاريخ الإلتحاق بالخدمة" ? "" : str3b;
    }
  });
  if (conscripte.promotions && conscripte.promotions.length > 0) {
    conscripte.allDegreesMap = conscripte.promotions.map(p => p.degree);
    conscripte.allDegrees = conscripte.allDegreesMap.join(" --- ");
    conscripte.firstDegree = conscripte.allDegreesMap[0];
    conscripte.lastDegree =
      conscripte.allDegreesMap[conscripte.allDegreesMap.length - 1];
  }
  conscripte.units = [];
  page5.forEach((straya, i) => {
    // Units
    let str = straya.str,
      str1b = page5[i - 1] ? page5[i - 1].str : "",
      str2b = page5[i - 2] ? page5[i - 2].str : "";
    // Units
    if (webUnits.includes(getNumberFromString(str)) || webUnits.includes(str)) {
      conscripte.units.push(getNumberFromString(str));
    }
    if (str.includes("التــــــوقيـــــع")) {
      if (
        !conscripte.units.includes(getNumberFromString(str2b)) &&
        str2b.length > 0 &&
        str2b !== "الوحدة"
      ) {
        conscripte.units.push(getNumberFromString(str2b));
      }
    }
  });
  if (conscripte.units && conscripte.units.length > 0) {
    conscripte.allUnits = conscripte.units.join(" --- ");
    conscripte.firstUnit = conscripte.units[0];
    conscripte.lastUnit = conscripte.units[conscripte.units.length - 1];
  }
  // let page3ToUse = page1Is1Page ? page3 : page4;
  // page3ToUse.forEach((straya, i) => {
  //   // Educational Classes && Termination Data
  //   let str = straya.str,
  //     str1b = page3ToUse[i - 1] ? page3ToUse[i - 1].str : "",
  //     str2b = page3ToUse[i - 2] ? page3ToUse[i - 2].str : "",
  //     str3b = page3ToUse[i - 3] ? page3ToUse[i - 3].str : "";
  //   // Termination Data
  //   if (str == "تاريخ إنهاء الخدمة") {
  //     conscripte.webDemobilizationDate =
  //       str1b == "تاريخ التجنيد" ? "" : `${str1b}-${str2b}-${str3b}`;
  //   }
  //   if (str == "مدة الخدمة") {
  //     conscripte.webServicePeriod =
  //       str1b == "تاريخ إنهاء الخدمة" ? "" : `${str1b}-${str2b}-${str3b}`;
  //   }
  //   if (str == "المدة الفاقدة") {
  //     conscripte.webLostPeriod =
  //       str1b == "مدة الخدمة" ? "" : `${str1b}-${str2b}-${str3b}`;
  //   }
  //   if (str == "صافي مدة الخدمة") {
  //     conscripte.webClearServicePeriod =
  //       str1b == "المدة الفاقدة" ? "" : `${str1b}-${str2b}-${str3b}`;
  //   }
  //   if (str == "درجة الأخلاق") {
  //     conscripte.webMoralsDegree = str1b == "صافي مدة الخدمة" ? "" : str1b;
  //   }
  //   // Educational Classes
  //   if (
  //     str.includes("القسم الرابع") &&
  //     str1b !== "" &&
  //     str1b !== "اسم الفرقة / الدورة"
  //   ) {
  //     // has classes
  //   }
  // });
  conscripte.penalities = [];
  // conscripte.penaltiesNumbers = [];
  penpages = [page7, page8];

  penpages.forEach(currentPage => {
    let penaltiesNumbers = currentPage.filter(
      f => arabicNumbers.includes(f.str) && f.height == 10
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
    // conscripte.penaltiesNumbers.push(penaltiesNumbers);

    penaltiesNumbers.forEach(pn => {
      let numberInInteger = getNumberFromString(pn.str);
      if (numberInInteger <= length || true) {
        let pIndex = currentPage.findIndex(
          f =>
            f.str == pn.str &&
            f.height == pn.height &&
            f.x == pn.x &&
            f.y == pn.y &&
            f.pageNumber == pn.pageNumber
        );
        let dateIsNear = currentPage[pIndex - 2].str.includes("-");
        let myLine = currentPage.filter(
          f => f.y == pn.y - 1 && f.pageNumber == pn.pageNumber
        );
        let period =
          myLine[myLine.length - 2] && myLine[myLine.length - 2].str
            ? myLine[myLine.length - 2].str
            : null;
        let periodNumbers = period ? getNumberFromString(period) : null;
        let periodInDays = "";
        if (periodNumbers && periodNumbers.includes("يوم")) {
          periodInDays = `${Number(periodNumbers.replace("يوم", "").trim())}`;
        }
        if (
          periodNumbers &&
          (periodNumbers.includes("شهر") || periodNumbers.includes("شهور"))
        ) {
          periodInDays = `${Number(
            periodNumbers
              .replace("شهر", "")
              .replace("شهور", "")
              .trim()
          ) * 30}`;
        }
        if (
          periodNumbers &&
          (periodNumbers.includes("سنة") ||
            periodNumbers.includes("سنه") ||
            periodNumbers.includes("سنين"))
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
            currentPage[periodIndex - 2].str.includes("حجز") ||
            currentPage[periodIndex - 2].str.includes("بالمعسكر") ||
            currentPage[periodIndex - 2].str.includes("القطع") ||
            currentPage[periodIndex - 2].str.includes("زيادة") ||
            currentPage[periodIndex - 2].str.includes("التكليف")),
          ordererIs3LineLong = ordererIsNear
            ? false
            : currentPage[periodIndex - 3].str.includes("مدير") &&
            currentPage[periodIndex - 3].str.includes("ادارة");
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
            currentPage[typeIndex] && currentPage[typeIndex + 1]
              ? currentPage[typeIndex].str +
              " " +
              currentPage[typeIndex + 1].str
              : null,
          // unitOfPen = currentPage[typeIndex + 2],
          isCourt =
            currentPage[typeIndex] &&
            currentPage[typeIndex].str.includes("محكمة"),
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
          if (
            !currentPage[periodIndex - 2].str.includes("القطع") &&
            (!currentPage[periodIndex - 2].str.includes("بالمعسكر") ||
              (currentPage[periodIndex - 2].str.includes("بالمعسكر") &&
                (currentPage[periodIndex - 2].str.includes("حجز") ||
                  currentPage[periodIndex - 2].str.includes("حبس")))) &&
            !currentPage[periodIndex - 2].str.includes("زيادة")
          ) {
            // Single line penality
            penalty = currentPage[periodIndex - 2].str;
            if (currentPage[periodIndex - 3].str.length > 5) {
              from = currentPage[periodIndex - 3].str;
              if (currentPage[periodIndex - 4].str.length > 5) {
                // one line date
                to = currentPage[periodIndex - 4].str;
                orderNumber = currentPage[periodIndex - 5].str;
              } else {
                to =
                  currentPage[periodIndex - 5].str +
                  "" +
                  currentPage[periodIndex - 4].str;
                if (!is4CharYear(to)) {
                  to =
                    currentPage[periodIndex - 4].str +
                    "" +
                    currentPage[periodIndex - 5].str;
                }
                orderNumber = currentPage[periodIndex - 6].str;
              }
            } else {
              from =
                currentPage[periodIndex - 4].str +
                "" +
                currentPage[periodIndex - 3].str;
              if (!is4CharYear(from)) {
                from =
                  currentPage[periodIndex - 3].str +
                  "" +
                  currentPage[periodIndex - 4].str;
              }
              if (currentPage[periodIndex - 5].str.length > 5) {
                // one line date
                to = currentPage[periodIndex - 5].str;
                orderNumber = currentPage[periodIndex - 6].str;
              } else {
                to =
                  currentPage[periodIndex - 6].str +
                  "" +
                  currentPage[periodIndex - 5].str;
                if (!is4CharYear(to)) {
                  to =
                    currentPage[periodIndex - 5].str +
                    "" +
                    currentPage[periodIndex - 6].str;
                }
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
              if (currentPage[periodIndex - 5].str.length > 5) {
                // one line date
                to = currentPage[periodIndex - 5].str;
                orderNumber = currentPage[periodIndex - 6].str;
              } else {
                to =
                  currentPage[periodIndex - 6].str +
                  "" +
                  currentPage[periodIndex - 5].str;
                if (!is4CharYear(to)) {
                  to =
                    currentPage[periodIndex - 5].str +
                    "" +
                    currentPage[periodIndex - 6].str;
                }
                orderNumber = currentPage[periodIndex - 7].str;
              }
            } else {
              from =
                currentPage[periodIndex - 5].str +
                "" +
                currentPage[periodIndex - 4].str;
              if (!is4CharYear(from)) {
                from =
                  currentPage[periodIndex - 4].str +
                  "" +
                  currentPage[periodIndex - 5].str;
              }
              if (currentPage[periodIndex - 6].str.length > 5) {
                // one line date
                to = currentPage[periodIndex - 6].str;
                orderNumber = currentPage[periodIndex - 7].str;
              } else {
                to =
                  currentPage[periodIndex - 7].str +
                  "" +
                  currentPage[periodIndex - 6].str;
                if (!is4CharYear(to)) {
                  to =
                    currentPage[periodIndex - 6].str +
                    "" +
                    currentPage[periodIndex - 7].str;
                }
                orderNumber = currentPage[periodIndex - 8].str;
              }
            }
          }
        } else {
          // Check if Orderer is 3 Lines long
          if (ordererIs3LineLong) {
            if (
              !currentPage[periodIndex - 4].str.includes("القطع") &&
              (!currentPage[periodIndex - 4].str.includes("بالمعسكر") ||
                (currentPage[periodIndex - 4].str.includes("بالمعسكر") &&
                  (currentPage[periodIndex - 4].str.includes("حجز") ||
                    currentPage[periodIndex - 4].str.includes("حبس")))) &&
              !currentPage[periodIndex - 4].str.includes("زيادة")
            ) {
              penalty = currentPage[periodIndex - 4].str;
              if (
                currentPage[periodIndex - 5] &&
                currentPage[periodIndex - 5].str.length > 5
              ) {
                from = currentPage[periodIndex - 5]
                  ? currentPage[periodIndex - 5].str
                  : null;
                if (currentPage[periodIndex - 6].str.length > 5) {
                  // one line date
                  to = currentPage[periodIndex - 6].str;
                  orderNumber = currentPage[periodIndex - 7].str;
                } else {
                  to =
                    currentPage[periodIndex - 7].str +
                    "" +
                    currentPage[periodIndex - 6].str;
                  if (!is4CharYear(to)) {
                    to =
                      currentPage[periodIndex - 6].str +
                      "" +
                      currentPage[periodIndex - 7].str;
                  }
                  orderNumber = currentPage[periodIndex - 8].str;
                }
              } else {
                from = currentPage[periodIndex - 6]
                  ? currentPage[periodIndex - 6].str +
                  "" +
                  currentPage[periodIndex - 5].str
                  : null;
                if (
                  currentPage[periodIndex - 7] &&
                  currentPage[periodIndex - 7].str.length > 5
                ) {
                  // one line date
                  to = currentPage[periodIndex - 7].str;
                  orderNumber = currentPage[periodIndex - 8].str;
                } else {
                  to = currentPage[periodIndex - 8]
                    ? currentPage[periodIndex - 8].str +
                    "" +
                    currentPage[periodIndex - 7].str
                    : null;
                  if (!is4CharYear(to)) {
                    to = currentPage[periodIndex - 7]
                      ? currentPage[periodIndex - 7].str +
                      "" +
                      currentPage[periodIndex - 8].str
                      : null;
                  }
                  orderNumber = currentPage[periodIndex - 9]
                    ? currentPage[periodIndex - 9].str
                    : null;
                }
              }
            } else {
              penalty = currentPage[periodIndex - 5]
                ? currentPage[periodIndex - 5].str +
                " " +
                currentPage[periodIndex - 4].str
                : "";
              if (
                currentPage[periodIndex - 6] &&
                currentPage[periodIndex - 6].str.length > 5
              ) {
                from = currentPage[periodIndex - 6].str;
                if (currentPage[periodIndex - 7].str.length > 5) {
                  // one line date
                  to = currentPage[periodIndex - 7].str;
                  orderNumber = currentPage[periodIndex - 8].str;
                } else {
                  to =
                    currentPage[periodIndex - 8].str +
                    "" +
                    currentPage[periodIndex - 7].str;
                  if (!is4CharYear(to)) {
                    to =
                      currentPage[periodIndex - 7].str +
                      "" +
                      currentPage[periodIndex - 8].str;
                  }
                  orderNumber = currentPage[periodIndex - 9].str;
                }
              } else {
                from = currentPage[periodIndex - 7]
                  ? currentPage[periodIndex - 7].str +
                  "" +
                  currentPage[periodIndex - 6].str
                  : "";
                if (!is4CharYear(from)) {
                  from = currentPage[periodIndex - 6]
                    ? currentPage[periodIndex - 6].str +
                    "" +
                    currentPage[periodIndex - 7].str
                    : "";
                }
                if (
                  currentPage[periodIndex - 8] &&
                  currentPage[periodIndex - 8].str.length > 5
                ) {
                  // one line date
                  to = currentPage[periodIndex - 8].str;
                  orderNumber = currentPage[periodIndex - 9].str;
                } else {
                  to = currentPage[periodIndex - 9]
                    ? currentPage[periodIndex - 9].str +
                    "" +
                    currentPage[periodIndex - 8].str
                    : "";
                  if (!is4CharYear(to)) {
                    to = currentPage[periodIndex - 8]
                      ? currentPage[periodIndex - 8].str +
                      "" +
                      currentPage[periodIndex - 9].str
                      : "";
                  }
                  orderNumber = currentPage[periodIndex - 10]
                    ? currentPage[periodIndex - 10].str
                    : "";
                }
              }
            }
          } else {
            if (
              !currentPage[periodIndex - 3].str.includes("القطع") &&
              (!currentPage[periodIndex - 3].str.includes("بالمعسكر") ||
                (currentPage[periodIndex - 3].str.includes("بالمعسكر") &&
                  (currentPage[periodIndex - 3].str.includes("حجز") ||
                    currentPage[periodIndex - 3].str.includes("حبس")))) &&
              !currentPage[periodIndex - 3].str.includes("زيادة")
            ) {
              penalty = currentPage[periodIndex - 3].str;
              if (
                currentPage[periodIndex - 4] &&
                currentPage[periodIndex - 4].str.length > 5
              ) {
                from = currentPage[periodIndex - 4]
                  ? currentPage[periodIndex - 4].str
                  : null;
                if (currentPage[periodIndex - 5].str.length > 5) {
                  // one line date
                  to = currentPage[periodIndex - 5].str;
                  orderNumber = currentPage[periodIndex - 6].str;
                } else {
                  to =
                    currentPage[periodIndex - 6].str +
                    "" +
                    currentPage[periodIndex - 5].str;
                  if (!is4CharYear(to)) {
                    to =
                      currentPage[periodIndex - 5].str +
                      "" +
                      currentPage[periodIndex - 6].str;
                  }
                  orderNumber = currentPage[periodIndex - 7].str;
                }
              } else {
                from = currentPage[periodIndex - 5]
                  ? currentPage[periodIndex - 5].str +
                  "" +
                  currentPage[periodIndex - 4].str
                  : null;
                if (
                  currentPage[periodIndex - 6] &&
                  currentPage[periodIndex - 6].str.length > 5
                ) {
                  // one line date
                  to = currentPage[periodIndex - 6].str;
                  orderNumber = currentPage[periodIndex - 7].str;
                } else {
                  to = currentPage[periodIndex - 7]
                    ? currentPage[periodIndex - 7].str +
                    "" +
                    currentPage[periodIndex - 6].str
                    : null;
                  if (!is4CharYear(to)) {
                    to = currentPage[periodIndex - 6]
                      ? currentPage[periodIndex - 6].str +
                      "" +
                      currentPage[periodIndex - 7].str
                      : null;
                  }
                  orderNumber = currentPage[periodIndex - 8]
                    ? currentPage[periodIndex - 8].str
                    : null;
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
                if (currentPage[periodIndex - 6].str.length > 5) {
                  // one line date
                  to = currentPage[periodIndex - 6].str;
                  orderNumber = currentPage[periodIndex - 7].str;
                } else {
                  to =
                    currentPage[periodIndex - 7].str +
                    "" +
                    currentPage[periodIndex - 6].str;
                  if (!is4CharYear(to)) {
                    to =
                      currentPage[periodIndex - 6].str +
                      "" +
                      currentPage[periodIndex - 7].str;
                  }
                  orderNumber = currentPage[periodIndex - 8].str;
                }
              } else {
                from = currentPage[periodIndex - 6]
                  ? currentPage[periodIndex - 6].str +
                  "" +
                  currentPage[periodIndex - 5].str
                  : "";
                if (!is4CharYear(from)) {
                  from = currentPage[periodIndex - 5]
                    ? currentPage[periodIndex - 5].str +
                    "" +
                    currentPage[periodIndex - 6].str
                    : "";
                }
                if (
                  currentPage[periodIndex - 7] &&
                  currentPage[periodIndex - 7].str.length > 5
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
                  if (!is4CharYear(to)) {
                    to = currentPage[periodIndex - 7]
                      ? currentPage[periodIndex - 7].str +
                      "" +
                      currentPage[periodIndex - 8].str
                      : "";
                  }
                  orderNumber = currentPage[periodIndex - 9]
                    ? currentPage[periodIndex - 9].str
                    : "";
                }
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
              : penalty.includes("الشامل") || penalty.includes("الايقاف")
                ? "الايقاف الشامل"
                : penalty.includes("التكليف") ||
                  penalty.includes("بخدمة") ||
                  penalty.includes("زيادة")
                  ? "التكليف بخدمة زيادة"
                  : penalty,
          orderer = ordererIsNear
            ? currentPage[periodIndex - 1].str
            : ordererIs3LineLong
              ? currentPage[periodIndex - 3].str +
              " " +
              currentPage[periodIndex - 2].str +
              " " +
              currentPage[periodIndex - 1].str
              : currentPage[periodIndex - 2]
                ? currentPage[periodIndex - 2].str +
                " " +
                currentPage[periodIndex - 1].str
                : "";
        let pen = {
          militaryId: conscripte.militaryId,
          date: crimeFromDate,
          // date: dateIsNear
          //   ? currentPage[pIndex - 1].str
          //   : `${currentPage[pIndex - 2].str}${currentPage[pIndex - 1].str}`,
          crimeText: crimeText.slice(0, 300),
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
  conscripte.penalities = conscripte.penalities.filter(f => f.crimeText);
  conscripte.penalitiesCounter = conscripte.penalities.length;
  return conscripte;
};
