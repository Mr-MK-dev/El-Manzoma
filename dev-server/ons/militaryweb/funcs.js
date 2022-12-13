let { webUnits, arabicNumbers } = require("./vars");

let is4CharYear = function(date) {
  if (date.split("/")[2].trim().length > 4) {
    return false;
  }
  return true;
};

let fixDateSpaces = function(str) {
  if (str && str.length > 0) {
    let reversedStr = str
        .split(" ")
        .join("")
        .trim()
        .replace("/", "-")
        .replace("/", "-")
        .split("-")
        .reverse()
        .join("-"),
      isDate = reversedStr.split("-").length == 3;
    if (isDate) {
      /*
    *   Date vs ReversedDate
      - Date is like " 2020-01-20 "  " YYYY-MM-dd "
      - ReversedDate is like " 20-01-2020 "  " dd-MM-YYYY "
      -----------------------------------------------------
      ! It's not correct to save date in reversed format,
      ! because Javascript will see it in " MM-dd-YYYY "
      ! depending on the current machine localization.
      TODO: So, We need to detect and convert reversed date into normal formatted date
    */
      let is3Y3M =
        reversedStr.split("-")[0].length == 3 &&
        reversedStr.split("-")[2].length == 3;
      // console.log(is3Y3M);
      // ٢٠١/٣٠/١٢٩
      if (is3Y3M) {
        let lastChar = reversedStr.split("-")[0].split("")[2];
        reversedStr =
          reversedStr
            .split("")
            .slice(0, 2)
            .join("") +
          reversedStr
            .split("")
            .slice(3, reversedStr.length)
            .join("") +
          lastChar;
      }
      let year = reversedStr.split("-")[2];
      // console.log(year);
      let isReversedDate = year.length !== 4;
      reversedStr = !isReversedDate
        ? reversedStr
            .split("-")
            .reverse()
            .join("-")
        : reversedStr;
      year = reversedStr.split("-")[0];
      // console.log(year);
      let reversedYear =
          year && year[0] == "0" ? year.slice(1, year.length) + "0" : year,
        month = reversedStr.split("-")[1];
      if (Number(getNumberFromString(month)) > 12) {
        reversedStr = reversedStr
          .split("-")
          .reverse()
          .join("-");
      }
      // console.log(reversedStr + " : " + isReversedDate);
      // * Reverse the reversed date
      let finalDate = reversedStr.replace(year, reversedYear);
      if (finalDate.split("-")[0].length == 4) {
        finalDate = finalDate
          .split("-")
          .reverse()
          .join("-");
      }

      // Fix 0200 Error
      finalDate = finalDate.replace("0200", "2020");
      // console.log(finalDate);
      return finalDate;
    } else {
      return null;
    }
  }
  return null;
};

let fixConscripteNumbers = function(c) {
  Object.keys(c).forEach(key => {
    if (typeof c[key] == "string") {
      c[key] = getNumberFromString(c[key]);
      if (key.includes("Date") || key.includes("date")) {
        c[key] = fixDateSpaces(c[key]);
      }
    } else {
      if (Array.isArray(c[key])) {
        c[key].forEach((el, i) => {
          if (typeof el == "string") {
            c[key][i] = getNumberFromString(el);
            if (key.includes("Date") || key.includes("date")) {
              c[key][i] = fixDateSpaces(el);
            }
          } else {
            if (!Array.isArray(el)) {
              Object.keys(el).forEach(elkey => {
                c[key][i][elkey] = getNumberFromString(el[elkey]);
                if (elkey.includes("Date") || elkey.includes("date")) {
                  c[key][i][elkey] = fixDateSpaces(c[key][i][elkey]);
                }
              });
            }
          }
        });
      } else {
        Object.keys(c[key]).forEach(ckey => {
          if (typeof c[key][ckey] == "string") {
            c[key][ckey] = getNumberFromString(c[key][ckey]);
            if (ckey.includes("Date") || ckey.includes("date")) {
              c[key][ckey] = fixDateSpaces(c[key][ckey]);
            }
          }
        });
      }
    }
  });
  return c;
};

let fixNumbers = function(str) {
  let p_numbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
    a_numbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  if (typeof str === "string") {
    for (let i = 0; i < 10; i++) {
      str = str.replace(p_numbers[i], i).replace(a_numbers[i], i);
    }
  }
  return str;
};
let getConscriptionPeriodText = function(date) {
  let d = new Date(date);
  if (d == "Invalid Date") {
    return "";
  } else {
    let year = d.getFullYear(),
      month = Number(d.getMonth()) + 1,
      period = Math.ceil(month / 3.9);
    return `${year}/${period}`;
  }
};

let fixPeriodToDays = function(period) {
  if (period) {
    let periods = period.split("-"),
      days = Number(periods[0]),
      months = Number(periods[1]),
      years = Number(periods[2]);
    return `${years * 12 * 30 + months * 30 + days}`;
  } else {
    return null;
  }
};

let getNumberFromString = function(str) {
  let p_numbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
    a_numbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  if (typeof str === "string") {
    for (let i = 0; i < 10; i++) {
      str = str
        .replace(p_numbers[i], i)
        .replace(a_numbers[i], i)
        .trim();
    }
  }
  return str;
};

let onlyNumbers = function(str) {
  let letters = [
      "ا",
      "أ",
      "إ",
      "ب",
      "ت",
      "ث",
      "ج",
      "ح",
      "خ",
      "د",
      "ذ",
      "ر",
      "ز",
      "س",
      "ش",
      "ص",
      "ض",
      "ط",
      "ظ",
      "ع",
      "غ",
      "ف",
      "ق",
      "ك",
      "ل",
      "م",
      "ن",
      "ه",
      "و",
      "ي",
      "ى",
      "/",
      "-",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "b",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ],
    ok = true;
  letters.forEach(letter => {
    if (ok) {
      if (str.includes(letter)) {
        ok = false;
      }
    }
  });
  return ok;
};
module.exports = {
  is4CharYear,
  fixDateSpaces,
  fixConscripteNumbers,
  fixNumbers,
  getConscriptionPeriodText,
  fixPeriodToDays,
  getNumberFromString,
  onlyNumbers
};
