"use strict";

// Change locale to run Date in new Manzoma
let cmd = require("child_process");
let changeLocale = function(locale, format, num) {
  let localName = `reg add "HKCU\\Control Panel\\International" /t REG_SZ /v LocaleName /d ${locale} /f`,
    formatDate = `reg add "HKCU\\Control Panel\\International" /t REG_SZ /v sShortDate /d ${format} /f`,
    numShape = `reg add "HKCU\\Control Panel\\International" /t REG_SZ /v NumShape /d ${num} /f`;
  cmd.exec(localName);
  cmd.exec(formatDate);
  cmd.exec(numShape);
};
changeLocale("en-US", "dd-MM-yyyy", "1");
const lodash = require("lodash");

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  session,
  shell
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

import AutoLaunch from "auto-launch";
let autoLauncher = new AutoLaunch({
  name: "ManzomaSegelat"
});

// wrking afteer the pc startup .
autoLauncher

  .isEnabled()
  .then(isEnabled => {
    if (isEnabled) return;
    autoLauncher.enable();
  })
  .catch(error => {
    throw error;
  });

const isDevelopment = process.env.NODE_ENV !== "production";
process.env.TZ = "Africa/Cairo";

let webwinOpened = false;

// Allow WebScraping
// app.commandLine.appendSwitch("disable-site-isolation-trials");
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
// app.commandLine.appendSwitch("disable-features", "x-frame-options");
// disabled-x-frame-options
app.commandLine.appendSwitch("--lang", "en-US");
/*
  ! The next line will result in an error
  ! It will stop the application from Mounting on 32bit Windows
*/
// app.commandLine.appendSwitch("js-flags", "--max-old-space-size=4096");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let webwin; // دي عشان لما نفتح ويندو للشبكة العسكرية

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    // x: 10,
    // y: 80,
    // frame: false,`
    // contextMenus: true,
    // alwaysOnTop: true,
    // opacity: 0,
    webSecurity: false,
    experimentalFeatures: true,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
      contextIsolation: false,
      webSecurity: false,
      webviewTag: true
      // contextMenus: true
    }
  });
  ipcMain.on("force-close", event => {
    changeLocale("ar-EG", "dd-MM-yyyy", "2");
    app.quit();
  });
  // win.hide();
  win.webContents.on(
    "new-window",
    async (event, url, frameName, disposition, options) => {
      event.preventDefault();
      if (url.includes("/websites")) {
        if (!webwin) {
          webwinOpened = true;
          webwin = new BrowserWindow({
            width: 1200,
            height: 700,
            frame: false,
            webSecurity: false,
            experimentalFeatures: true,
            webPreferences: {
              nodeIntegration: true,
              experimentalFeatures: true,
              contextIsolation: false,
              webSecurity: false,
              webviewTag: true
            }
          });
          webwin.maximize();
          webwin.removeMenu();

          if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            if (!process.env.IS_TEST) {
              webwin.webContents.openDevTools();
            }
            await webwin.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
          } else {
            // Load the index.html when not in development
            await webwin.loadURL("app://./index.html");
          }

          webwin.on("closed", () => {
            webwin = null;
            webwinOpened = false;
          });

          webwin.webContents.on(
            "new-window",
            async (event, url, frameName, disposition, options) => {
              event.preventDefault();
            }
          );
        }

        // this block of code respose for any download in internal browser
        let sendDownloadProgress = async (filename, path, perc, state) => {
          await webwin.webContents.send("download-progress", {
            filename,
            path,
            perc,
            state
          });
        };

        let oneFileExist = false;
        let counter = 0;

        webwin.webContents.session.on(
          "will-download",
          async (event, item, webContents) => {
            console.log("counter", counter++);
            // Set the save path, making Electron not to prompt a save dialog.

            let path = app.getPath("downloads");
            let randomNum =
              Math.floor(Math.random() * 100) + Math.floor(Math.random() * 150);
            let fileName = randomNum + "-" + item.getFilename(),
              filePath = path + "/" + fileName;
            console.log(filePath);

            item.setSavePath(filePath);

            await webwin.webContents.send("download-start");

            item.on("updated", async (event, state) => {
              if (state === "interrupted") {
                console.log("Download is interrupted but can be resumed");
                let perc = Math.floor(
                  (item.getReceivedBytes() / item.getTotalBytes()) * 100
                );
                await sendDownloadProgress(fileName, filePath, perc, state);
                console.log(`Received bytes: ${item.getReceivedBytes()}`);
              } else if (state === "progressing") {
                if (item.isPaused()) {
                  console.log("Download is paused");
                } else {
                  let perc = Math.floor(
                    (item.getReceivedBytes() / item.getTotalBytes()) * 100
                  );
                  await sendDownloadProgress(fileName, filePath, perc, state);
                  console.log(`Received bytes: ${item.getReceivedBytes()}`);
                }
              }
            });

            ipcMain.on("download-exit", (event, x = false) => {
              if (xs.exit == true) {
                console.log("canceeld");
                item.cancel();
              }
            });

            item.once("done", (event, state) => {
              if (state === "completed") {
                console.log("Download successfully");
                let path = item.getSavePath();
                // open file
                shell.openPath(path);
              } else {
                console.log(`Download failed: ${state}`);
              }
              oneFileExist = false;
            });
          }
        );
      }
    }
  );

  // console.log("win.webContents.session.webRequest");
  // console.log(win.webContents.session.webRequest);
  // win.webContents.session.webRequest.onHeadersReceived({}, (d, c) => {
  //   console.log(d.responseHeaders);
  //   if (d.responseHeaders["X-Frame-Options"]) {
  //     delete d.responseHeaders["X-Frame-Options"];
  //   }
  //   c({ cancel: false, responseHeaders: d.responseHeaders });
  // });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.removeMenu();
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    await win.loadURL("app://./index.html");
  }

  win.on("close", e => {
    try {
      dbs.af.SessionTracking.update(
        { SessionEndtDate: new Date() },
        {
          where: { ID_KEY: user.SessionID }
        }
      );
    } catch (error) {
      console.log("error with session end", error);
    }
  });

  win.on("closed", () => {
    win = null;
    webwin = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar,
  // to stay active until the user quits explicitly with Cmd + Q
  // Change locale to run Date in new Manzoma
  changeLocale("ar-EG", "dd-MM-yyyy", "2");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (BrowserWindow.getAllWindows().length === 0) createWindow();
  if (win === null) {
    createWindow();
    win.removeMenu();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
  win.removeMenu();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
let user = {};
// console.log("Ana Wasaaaaaalt");

// const { Sequelize, DataTypes, Op } = require("sequelize");

// const sequelize = new Sequelize("seksek", "", "", {
//   host: "localhost",
//   dialect: "sqlite",
//   storage: "./seksekdds.db"
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("authenticateeeeeeeeeed");
//   })
//   .catch(() => {
//     console.log("Errorrrrrrrrrroooooorrrr");
//   });

// console.log("3addeeeeeeet");

let dbs = require("./server-sequelize");
let promises = [];
Object.keys(dbs).forEach(db => {
  promises.push(
    dbs[db].sequelize.authenticate({ pool: { evict: 1000 * 60 * 60 * 60 } })
  );
  promises.push(dbs[db].sequelize.sync());
});

let runPromises = async () => {
  await Promise.all(promises);
};
runPromises();
const path = require("path");

async function getPrevRecord(table, where) {
  let record = await dbs.af[table].findOne({
    where
  });
  return record;
}
async function getCurrentRecord(table, where) {
  let record = await dbs.af[table].findOne({
    where
  });
  return record;
}
let previous_record;

ipcMain.on("db-send-api", async (event, args) => {
  let [query, params, req_id, dbname] = args;
  user = params.currentUser;
  previous_record =
    query == "global/update_one"
      ? await getPrevRecord(params.table, params.where)
      : null;

  if (params.noAsync) {
    let result = require(`./server-sequelize/reciever/${dbname}/${query}.js`)(
      dbs[dbname],
      params,
      win,
      dbs,
      webwin
    );

    event.reply(`db-reply-api-${req_id}`, {
      ok: true, // result !== null
      data: result,
      dirname: __dirname
    });
  } else {
    require(`./server-sequelize/reciever/${dbname}/${query}.js`)(
      dbs[dbname],
      params,
      win,
      dbs,
      webwin
    )
      .then(result => {
        dbTracking(query, params, previous_record);
        event.reply(`db-reply-api-${req_id}`, {
          ok: true, // result !== null
          data: result,
          dirname: path.resolve(
            __dirname,
            `${isDevelopment ? "../" : "../../"}docto.exe`
          )
        });
      })
      .catch(error => {
        console.log(error);
        event.reply(`db-reply-api-${req_id}`, {
          ok: false,
          data: error,
          args
        });
      });
  }
});
const TABLES_AR_NAMES = {
  Brothers: "الأشقاء",
  Centre: "المركز",
  City: "المحافظه",
  Direction: "الإتجاه",
  DiscountTime: "DiscountTime",
  DistributionSuggestion: "مقترح التوزيع",
  DriversArrival: "تمام وصول السائقين",
  Duty: "الواجب المدرب عليه",
  Employes: "Employes",
  EndingCause: "سبب الإنهاء",
  Family: "العائله",
  Followerrateb: "الراتب العالي الملحقين",
  TrainingRateb: "الراتب العالي مهمة تدريبية",
  Followers: "الملحقين",
  FollowingNos: "FollowingNos",
  FollowingRigion: "مناطق  الإلحاق",
  Grade: "الدرجه",
  inventoryLevelup: "مخزن كروت الراتب العالي",
  Mosarah: "المسرح",
  Motabaa: "المتابعه",
  Moving: "التنقل",
  MyUsers: "المستخدمين",
  Neshan: "النياشين",
  NewComersArrivals: "وصول المستجدين",
  NewComersTimeline: "الخط الزمن للمستجدين",
  OldFollowersNo: "",
  Password: "Password",
  Permissions: "الصلاحيات",
  Rateb: "الراتب العالي",
  RatebX: "RatebX",
  Ratebzzz: "Ratebzzz",
  Recommendations: "توصيات حدود",
  RegisterationEssurance: "تمامات الوصول",
  SMDriversSuggestion: "امداد السائقين",
  SMSoldier: "محنديد الادارات التخصصيه",
  SelectionSoldier: "إنتقاءات الجنود",
  SelectionType: "نوع الإنتنقاءات",
  SelectionUsers: "إنتقاءات المستخدمين",
  Selections: "الإنتقاءات",
  SituationDecision: "قرارات المواقف",
  SituationStates: "حالات المواقف",
  Situations: "المواقف",
  Soldier: "المجندين",
  SpareSoldiers: "SpareSoldiers",
  Tankolat: "التنقلات",
  Tasreeh: "التسريح",
  TravalTable: "السفريات",
  Twsiat: "توصيات",
  Unit: "الوحده",
  UnitEngineersPlan: " ",
  UnitSelect: "اخيار الوحده",
  Unit_Jobs: "عمل الوحدات",
  UserPermissions: "صلاحيات المستخدم",
  users: "المستخدمين",
  Weapon: "السلاح",
  carruntlevel: "المرحلة الحاليه",
  chat: "chat",
  followersolider: "ملحقين جنود",
  TrainingSoldier: "مهمة تدريبية جنود",
  followerwork: "ااماكن العمل",
  makhzan: "المخزن",
  preuint: "الوحدات السابقة",
  prevlevelup: "الترقيات",
  punshments: "العقوبات",
  security: "الامني",
  shakawi: "شكاوي",
  suggest: "المقترح",
  tagdidMohab: "التجديد",
  tagdidrevsioin: "مراجعة التجديد",
  tahel: "التأهيل",
  tasgiltag: "tasgiltag",
  SMGeneral: "إدارات تخصصيه عامه",
  userTracking: "تعقب المستخدمين",
  Correspondences: "المتابعات",
  OfficerSoldierRecommendation: "توصيات جندي / ظابط",
  RatebGeneralKnowledge: "معلومات عامة عن الراتب العالي",
  SoldierSecuritySituations: "المواقف الامنية للمجندين",
  UnitEffecs: "مواقف الواحدات",
  SMRecommandations: "توصيات الادارت",
  RecommendationAndSelections: "توصيات الانتقاءات",
  Specialization: "التخصصات",
  Fittings: "التناسق",
  Colleges: "الكليات",
  Pattern: "الانماط",
  RecStages: "مراحل التجنيد",
  RatebTraineeShip: "فرق الراتب العالي",
  TraineeShip: "اسم الفرق",
  MortabatDuties: "الوظايف",
  SoldiersMedicalSituations: " الحالات الصحية للمجندين",
  EffectSituationStates: "انواع المؤثرات",
  FittingRules: "شروط التنساق",
  Sectors: "القطاعات",
  Point: "النقط",
  PointHub: "السرايا",
  Certificators: "المصدقين",
  TransferList: "نشرة التوزيع",
  Jobs: "التوظيف",
  RatebRecommendations: "توصيات الانتقال",
  RatebPenalities: "العثوبات",
  TransportLicense: "تراخيص النقل",
  Requests: "الالتماسات",
  PreviousJobs: "الخبرات السابقة",
  TransferCandidates: "مرشيح لانتقال",
  CommandRegions: "CommandRegions",
  AddPlans: "خظة اضافة للنشرة الانتقال",
  RemovePlans: "خطة شطب للنشرة الانقال",
  FollowingAreas: "FollowingAreas",
  RenewList: "نشرة التجديد",
  RenewCandidates: "مرشيحيم التجديد",
  RenewAddPlans: "خطة اضافة للنشرة التجديد",
  RenewRemovePlans: "خطة الشطة من نشرة التجديد",
  OutOfRenew: "خارج التوزيع",
  WebUnits: "WebUnits",
  TransferListBalancer: "ميزان نشرة الانتقال",
  TransferListJobBlancer: "ميزان الوظائف نشرة الانتقال",
  TransferListUnitErrors: "اخطاء الوحدات نشرة الأنتقال",
  EndingReasons: "اسباب انهاء",
  WeaponDutyPivot: "جدول السلاح و الواجب",
  Devices: "الأجهزة",
  TahelCourses: "فرق التأهيل",
  TransferAllocation: "نتيجة توزيعة نشرة الأنتقال",
  PunishmentTypes: "انواع العقوبات والجرائم",
  SoldiersPhsycoligicalSituations: "المواقف النفسية للمجندين",
  SoldiersSelectionSituations: "",
  RecuStartDates: "تواريخ التجنيد",
  UnitCollectionPivot: "جدول التجمعات القتالية والوحدات",
  UnitCollections: "التجمعات القتالية",
  distriputionPlanList: "قائمة خطة التوزيع",
  distriputionPlanStats: "حالة خطة التوزيع",
  enrollersPlanList: "قائمة خطة الملحقين",
  enrollersPlanDetails: "تفاصيل خطة الملحقين",
  RatebsMedicalSituations: "المواقف الطبية للراتب العالي",
  RatebsPhsycoligicalSituations: "المواقف النفسية للراتب العالي"
};

async function dbTracking(query, params, prev = null) {
  try {
    let queryMethod = "";
    let message = "";
    let table = TABLES_AR_NAMES[params.table];
    let data = "";
    let Changes = {};
    let current_record;
    let beforeChange = {};

    if (params.where && (params.where.ID || params.where.id))
      data = `${data} رقم عسكري : ${params.where.ID || params.where.id}`;

    if (params.where && params.where.Name)
      data = `${data} اسم : ${params.where.Name}`;

    if (query == "global/create_one") {
      queryMethod = "باضافة";
      message = `قام هذا المستخدم  ${queryMethod} بيان الي جدول ${table} مع بيانات ${data}`;
    } else if (query == "global/delete_all") {
      queryMethod = "بحذف";
      message = `قام هذا المستخدم  ${queryMethod} بيان من جدول ${table} مع بيانات ${data}`;
    } else if (query == "global/update_one") {
      current_record = await getCurrentRecord(params.table, params.where);
      Changes = Object.keys(current_record.dataValues).reduce(
        (diff, key) => {
          if (prev.dataValues[key] === current_record.dataValues[key])
            return diff;
          return {
            ...diff,
            [key]: current_record.dataValues[key]
          };
        },

        {}
      );
      Object.keys(Changes).forEach(
        key => (beforeChange[key] = prev.dataValues[key])
      );
      console.log("previous_record.dataValues", prev.dataValues);
      console.log("current_record.dataValues", current_record.dataValues);
      console.log("BeforeChanges", JSON.stringify(beforeChange));
      console.log("Changes", JSON.stringify(Changes));
      console.log("without stringfy Changes", Changes);

      queryMethod = "بتعديل";
      message = `قام هذا المستخدم  ${queryMethod} بيان في جدول ${table} مع بيانات ${data}`;
    }
    let date = new Date();
    date.setHours(date.getHours() + 2);
    if (queryMethod.length) {
      dbs.af.userTracking.create({
        message,
        queryMethod,
        tableName: table,
        whereCondition: JSON.stringify({
          ...params.where,
          ...params.search
        }),
        changes: JSON.stringify(Changes),
        beforeChange: JSON.stringify(beforeChange),
        transactionDate: date,
        userId: params.currentUser.userId
      });
    }
  } catch (e) {
    console.log("error", e);
    //s
  }
}
let fs = require("fs"),
  mkdirp = require("mkdirp"),
  getDirName = require("path").dirname;
// listen to uploading

function execAsync(command) {
  const exec = cmd.exec;
  return new Promise((success, failure) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        failure(err);
      }
      success(stdout ? stdout : stderr);
    });
  });
}
ipcMain.on("upload-send-api", async (event, args) => {
  let [request, params, req_id] = args,
    reply = { ok: true };
  let {
    drivePath,
    username,
    password,
    oldPath,
    newPath,
    base64,
    path
  } = params;
  switch (request) {
    case "connect":
      await execAsync(
        `net use  ${drivePath} /user:${username} ${password}`
      ).catch(err => {
        // this is not an error
        if (err.code == 2) {
          reply.error = "تحقق من الإتصال بوحدة التخزين";
          reply.ok = false;
        } else {
          //
        }
      });
      break;
    case "disconnect":
      // now clear from memory of windows
      // for some stupid reasons it's effect not work immediately but work after explorer restart
      // await execAsync(`net use /del ${drivePath}`).catch(err => {
      //   console.log(err);
      // });
      break;
    case "upload":
      await fs.promises
        .mkdir(getDirName(newPath), { recursive: true })
        .catch(err => {
          if (err.code == "UNKNOWN") {
            reply.error = " فشل في إنشاء فولدر للصور بوحدة التخزين";
            reply.ok = false;
            console.log(reply);
          } else if (err.code == "EEXIST" || err.code == "EXIST") {
            // not a problem
          }
        });
      if (reply.ok) {
        await fs.promises.copyFile(oldPath, newPath).catch(err => {
          if (err !== null) {
            reply.error = "فشل في رفع الصورة على وحدة التخزين";
            reply.ok = false;
            console.log(reply);
          }
        });
      }
      break;
    case "getImage":
      base64 = await fs.promises.readFile(path, "base64").catch(err => {
        reply.error = "فشل في تحميل الصورة من وحدة التخزين";
        reply.ok = false;
      });
      reply.data = "data:image/jpeg;base64," + base64;
      break;
    case "createImage":
      await fs.promises.mkdir(getDirName(path), { recursive: true });
      let imageBuffer = Buffer.from(base64).toString("base64");
      await fs.writeFile(path, imageBuffer, "base64", err => {
        //console.log(console.error(););
        console.log("File created");
      });
      break;
    default:
      // when the double mount happened @TODO delete the double mount
      reply = { ok: true };
      break;
  }
  event.reply(`upload-reply-api-${req_id}`, reply);
});
