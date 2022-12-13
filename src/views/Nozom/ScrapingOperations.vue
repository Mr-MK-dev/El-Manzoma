<template>
  <div class="mb-10">
    <v-row>
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title> اختيار وتشغيل العملية </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-autocomplete
              filled
              label="نوع العملية"
              v-model="operation.type"
              :items="operation_types"
              item-text="name"
              item-value="method"
              dense
            ></v-autocomplete>
          </v-card-text>
          <v-card-text class="text-center">
            <v-progress-circular
              size="350"
              color="primary"
              :indeterminate="operation.begin && !operation.perc"
              v-model="operation.perc"
            >
              <div v-if="!operation.begin">
                <div>
                  <v-btn
                    @click="runOperation(operation.type)"
                    icon
                    x-large
                    :disabled="!operation.type"
                    color="primary"
                  >
                    <v-icon>mdi-power</v-icon>
                  </v-btn>
                </div>
              </div>
              <div v-else>
                <div>
                  <v-card-title class="text-h1 d-block" dir="ltr"
                    >{{ operation.perc }} %</v-card-title
                  >
                </div>
              </div>
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title> النتائج </v-card-title>
          <v-divider></v-divider>
          <v-text-field
            v-model.lazy="results.search"
            filled
            dense
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-data-table
            height="335"
            :search.sync="results.search"
            :headers="results.headers"
            :items="results.items"
            v-model="results.selected"
            fixed-header
          >
            <template #item.operation_errors="{ item }">
              <div>
                <template v-for="(err, i) in item.operation_errors">
                  <v-chip small :key="i" class="font-weight-bold my-1">
                    {{ err }}
                  </v-chip>
                </template>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <div>
      <child1
        ref="child1"
        @IDScarped="IDScarped"
        :current-unit-id="currentUnitId"
        :currentCons="currentCons"
        :controlOp="controlOp"
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child1>
      <child2
        ref="child2"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child2>
      <child3
        ref="child3"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child3>
      <child4
        ref="child4"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child4>
    </div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="onePdf.model"
      scrollable
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف Pdf </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            v-model="onePdf.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="onePdf.model = false"
            large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="readOnePdf()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="jobFile.model"
      scrollable
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            v-model="jobFile.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="jobFile.model = false"
            large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessJobsFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="carFile.model"
      scrollable
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            v-model="carFile.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="carFile.model = false"
            large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessCarsFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="restore_options.model"
      persistent
      scrollable
      max-width="450"
    >
      <v-card>
        <v-card-title>
          استعادة قاعدة البيانات
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="restore_options.model = false"
            :disabled="restore_options.begin"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div v-if="restore_options.begin">
            <div class="mb-3">
              <v-progress-linear
                indeterminate
                color="primary"
                rounded
              ></v-progress-linear>
            </div>
            <div>
              من فضلك لا تقم بإغلاق الصفحة أو الخروج منها, أو إغلاق المنظومة
              أثناء استعادة قاعدة البيانات
            </div>
          </div>
          <div
            class="text-center"
            v-else-if="!restore_options.begin && restore_options.done"
          >
            <div class="mb-4">
              <v-icon size="75" color="success"
                >mdi-check-circle-outline</v-icon
              >
            </div>
            <div>
              تم استعادة قاعدة البيانات
            </div>
          </div>
          <div v-else>
            <v-file-input
              class="mb-3"
              type="file"
              prepend-icon=""
              label="الملف"
              hint="من فضلك قم بتحديد ملف قاعدة البيانات"
              persistent-hint
              filled
              v-model="restore_options.path"
            ></v-file-input>
            <v-autocomplete
              :items="backup_options.dbs"
              item-text="name"
              item-value="id"
              v-model="restore_options.dbname"
              filled
              persistent-hint
              hint="من فضلك حدد قاعدة البيانات المراد استعادتها"
              label="قاعدة البيانات"
            ></v-autocomplete>
            <div class="mt-4">
              <span class="error--text">
                ملحوظة :
              </span>
              لا تقم أبداً بإغلاق المنظومة أو الخروج من الصفحة أثناء استعادة
              قاعدة البيانات. لإن عملية استعادة قاعدة البيانات تقوم في البداية
              <span class="error-text">بحذف</span> قاعدة البيانات الموجودة
              بالكامل - إن كانت موجودة - ثم تقوم بإضافة قاعدة البيانات الجديدة.
            </div>
          </div>
        </v-card-text>
        <v-card-actions
          v-if="!restore_options.begin || restore_options.done"
          class="px-4"
        >
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="px-6"
            v-text="'عودة'"
            outlined
            @click="restore_options.model = false"
            large
          ></v-btn>
          <v-btn
            color="primary"
            class="px-6"
            :disabled="restore_options.begin || restore_options.done"
            v-text="'استعادة'"
            @click="restoreDB(true)"
            large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { NonFullScreenPageMode } from "pdf-lib";
("use strict");

export default {
  name: "CompleteFugitiveData",
  components: {
    Child1: () =>
      import("@/components/sections/admin/operations/webChilds/c1.vue"),
    Child2: () =>
      import("@/components/sections/admin/operations/webChilds/c2.vue"),
    Child3: () =>
      import("@/components/sections/admin/operations/webChilds/c3.vue"),
    Child4: () =>
      import("@/components/sections/admin/operations/webChilds/c4.vue")
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },
  data: () => ({
    componentName: "admin_operations",
    onePdf: {},
    controlOp: {
      currentOp: "",
      currentFunc: () => {},
      currentParams: [],
      pause: false,
      tryingToPause: false,
      disableOperateBtn: false,
      functions: {}
    },
    currentUnitId: null,
    tableFilters: {},

    onePdf: {
      model: "",
      loading: false
    },
    carFile: {
      model: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    jobFile: {
      model: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    restore_options: {
      model: false,
      done: false,
      begin: false,
      path: null,
      dbname: ""
    },
    backup_options: {
      model: false,
      done: false,
      begin: false,
      path: null,
      dbname: "",
      dbs: [
        {
          name: "قاعدة بيانات فرع الافراد",
          id: "NEWAFRAAD"
        }
      ]
    },
    file: null,
    allowChilds: true,
    stopOperationModel: false,
    stopOperationOk: false,
    operation: {
      stopIn: "",
      startIn: "",
      type: "",
      begin: false,
      perc: 0,
      done: 0,
      finish: false,
      errors: 0
    },
    noSavedOperations: ["backupDB", "update1sFromWebUnit"],
    operation_types: [
      {
        name: "تحديث بيانات الراتب العالي من الشبكة العسكرية",
        method: "UpdateFromWeb"
      },
      {
        name: " للاخطاء تحديث بيانات الراتب العالي من الشبكة العسكرية",
        method: "UpdateFailedFromWeb"
      },
      {
        name: " تحديث بيانات الصف حدود من الشبكة العسكرية",
        method: "updateHarasSolidersData"
      }
    ],
    results: {
      search: "",
      items: [],
      headers: [
        {
          text: "المعرف",
          sortable: false,
          value: "ID"
        },
        {
          text: "الحالة",
          sortable: false,
          value: "status"
        }
      ],
      selected: []
    },
    statusColors: {
      error: "error",
      done: "success"
    },
    statusTexts: {
      error: "خطأ",
      done: "اكتمل"
    },
    login_success: false,
    list_test: [],
    list_test_search: "",
    ids: [],
    currentIndex: 0,
    currentCons: [],
    scrapingType: "ratab"
  }),
  mounted() {},
  watch: {
    "operation.done"(done) {
      if (done && done > 0) {
        let all = this.result.items.length;
        this.$set(this.operation, "perc", Math.floor((done * 100) / all));
      }
    }
  },
  sockets: {
    gotUnitsFromWeb(x) {
      if (x.error) {
        this.$set(this, "list_test", x.error);
      }
      this.$set(this, "list_test", x.data);
      this.fixAndAddConscripte(x.data);
    }
  },
  methods: {
    async updateHarasSolidersData() {
      let ids = await this.api(`global/queryRunners`, {
        query: `SELECT ID FROM Soldier where Status = N'بالخدمة' and WeaponID = 52`
      });
      this.ids = ids.data.map(ele => ele.ID);
      this.scrapingType = "solider";
      this.getToken(0);
    },
    async IDScarped(event) {
      this.currentIndex++;
      this.operation.perc = Math.ceil(
        (this.currentIndex / this.ids.length) * 100
      );

      let id = event.id;
      this.results.items.push({
        ID: event.id,
        status: event.success ? this.statusTexts.done : this.statusTexts.error
      });

      if (event.success) {
        console.log("event", event);
        if (this.scrapingType !== "solider") {
          await this.api(`global/delete_all`, {
            table: "RatebPenalities",
            where: {
              ID: id
            }
          });

          // await Promise.all(
          //   event.conscripte.unitsWithDate.map(ele => {
          //     return this.api(`global/create_one`, {
          //       table: "WebUnits",
          //       where: {
          //         ID: ele.militaryId,
          //         UnitText: ele.unit,
          //         Date: ele.date
          //       }
          //     });
          //   })
          // );

          await Promise.all(
            event.conscripte.penalities.map(ele => {
              let cText = ele.crimeText;
              cText = cText.replaceAll(
                "الـــوظيــفة : قـــــــائد الوحـــــــــــــدة",
                " "
              );
              cText = cText.replaceAll(
                "رتــبة واســـم : مقدم / عماد محمد عبدالعظيم",
                " "
              );
              cText = cText.replaceAll(
                "التــــــوقيـــــع )......................................(",
                " "
              );
              return this.api(`global/create_one`, {
                table: "RatebPenalities",
                where: {
                  ID: id,
                  date: ele.date,
                  crimeText: cText,
                  crimeFromDate: ele.crimeFromDate,
                  crimeToDate: ele.crimeToDate,
                  periodInDays: ele.periodInDays,
                  orderer: ele.orderer,
                  withSalaryCut: ele.withSalaryCut,
                  fromDate: ele.fromDate,
                  toDate: ele.toDate,
                  type: ele.type,
                  kind: ele.kind,
                  orderNumber: ele.orderNumber,
                  orderDate: ele.orderDate,
                  isCourt: ele.isCourt,
                  courtDate: ele.courtDate,
                  courtPlace: ele.courtPlace
                }
              });
            })
          );
          await this.api(`global/update_one`, {
            table: "Rateb",
            where: {
              ID: id
            },
            update: {
              lastScrapingStatus: true
            }
          });
        } else {
          //         tripartiteNumber: '١٩٩٩-١٠٩-٢٢٢١',
          // area: 'المنيا',
          // additionalYear: 'بدون سنة زائده',
          // dutyState: 'بالخدمة',
          // qualification: 'متوسطة',
          // webConscriptionDate: '٢٠٢٠/١٠/٠٣',
          // caltureLevel: 'متوسطة',
          // medicalLevel: 'لائق',
          // civilQualificationGroup: 'الصناعات الزخرفية',
          // civilQualification: 'الزخرفة والاعلان والتنسيق',
          // bloodType: 'A',
          // religion: ' مسلم',
          // maritalStatus: 'أعزب',
          // phone: '',
          // jobBeforeConscription: '',
          // region: 'الجرنوس',
          // governorateBirthSide: 'المنيا',
          // qesm: 'بني مزار',
          // nationalId: '٢٩٩١١٠٣٢٤٠١٧٩٣',
          // governorateNationalCardSide: 'المنيا',
          // segelMadany: 'بني مزار',
          // address: 'الجرنوس'
          console.log({
            TripleNo: this.toEnglishDigits(event.conscripte.tripartiteNumber),
            RecuRegion: event.conscripte.area,
            KnowledgeLevel: event.conscripte.qualification,
            Treatment: event.conscripte.additionalYear,
            Address: event.conscripte.address,
            IdentityNo: this.toEnglishDigits(event.conscripte.nationalId),
            College: event.conscripte.civilQualificationGroup,
            Specialization: event.conscripte.civilQualification,
            SoldierTELE: event.conscripte.phone,
            Religion: event.conscripte.religion,
            BloodType: event.conscripte.bloodType
          });
          // await this.api(`global/update_one`, {
          //   table: "Soldier",
          //   where: {
          //     ID: id
          //   },
          //   update: {
          //     TripleNo: this.toEnglishDigits(event.conscripte.tripartiteNumber),
          //     RecuRegion: event.conscripte.area,
          //     KnowledgeLevel: event.conscripte.qualification,
          //     Treatment: event.conscripte.additionalYear,
          //     Address: event.conscripte.address,
          //     IdentityNo: this.toEnglishDigits(event.conscripte.nationalId),
          //     College: event.conscripte.civilQualificationGroup,
          //     Specialization: event.conscripte.civilQualification,
          //     SoldierTELE: event.conscripte.phone,
          //     Religion: event.conscripte.religion,
          //     BloodType: event.conscripte.bloodType
          //   }
          // });
        }
      } else {
        await this.api(`global/update_one`, {
          table: "Rateb",
          where: {
            ID: id
          },
          update: {
            lastScrapingStatus: false
          }
        });
      }
    },
    async UpdateFromWeb() {
      await this.api(`global/update_one`, {
        table: "Rateb",
        where: {
          Status: "بالخدمة"
        },
        update: {
          lastScrapingStatus: true
        }
      });
      let ids = await this.api(`global/queryRunners`, {
        query: `SELECT ID FROM Rateb where Status = N'بالخدمة' `
      });
      this.ids = ids.data.map(ele => ele.ID);
      this.getToken(0);
    },
    async UpdateFailedFromWeb() {
      let ids = await this.api(`global/queryRunners`, {
        query: `SELECT ID FROM Rateb where Status = N'بالخدمة' and lastScrapingStatus = 0 `
      });
      this.ids = ids.data.map(ele => ele.ID);
      console.log(this.ids);
      this.getToken(0);
    },
    getToken(index, asSegelat = false) {
      let xhttp = new XMLHttpRequest(),
        that = this,
        token = "";
      console.log("Getting Token..." + index);

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log("Got Token");

          let html = document.createElement("html");
          html.innerHTML = this.responseText;
          html.hidden = true;
          let token_inputs = html.getElementsByTagName("input");
          if (
            token_inputs["__RequestVerificationToken"] &&
            token_inputs["__RequestVerificationToken"].value
          ) {
            token = token_inputs["__RequestVerificationToken"].value;
            that.login(token, index, asSegelat);
          } else {
            if (asSegelat) {
              that.pushError({
                id: "الشبكة العسكرية",
                type: "ويب",
                errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية"]
              });
            } else {
              that.pushError({
                id: that.result.items[index].unitText,
                type: "وحدة",
                errors: ["تعذر تحميل معرف ارتباط الوحدة"]
              });
            }
          }
        }
      };
      xhttp.timeout = 6000;
      xhttp.onerror = function(error) {
        console.log("Error");
        console.log(error);
        if (!asSegelat) {
          //that.passUnit(index);
          that.pushError({
            id: that.result.items[index].unitText,
            type: "وحدة",
            errors: ["تعذر تحميل معرف ارتباط الوحدة", error]
          });
        } else {
          that.pushError({
            id: "الشبكة العسكرية",
            type: "ويب",
            errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية"]
          });
        }
      };
      xhttp.ontimeout = function(error) {
        console.log("Timeout");
        console.log(error);
        if (asSegelat) {
          that.pushError({
            id: "الشبكة العسكرية",
            type: "ويب",
            errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية عشان الشبكة فصلت"]
          });
        } else {
          that.pushError({
            id: that.result.items[index].unitText,
            type: "وحدة",
            errors: [
              "تعذر تحميل معرف ارتباط الوحدة عشان الشبكة العسكرية فصلت",
              error
            ]
          });
        }
      };
      xhttp.open("get", "http://1.33.1.150/segelat/Home/login/", true);
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send();
    },
    login(token = "", index, asSegelat = false) {
      let xhttp = new XMLHttpRequest(),
        that = this,
        params = [...arguments];
      console.log("Logging-in...", token);

      this.$set(this.operation, "begin", true);
      let { unitText, username, password, unitId } = {
        unitText: "السجلات العسكرية",
        username: "10000053",
        password: "army53",
        unitId: null
      };

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if (this.responseText.includes("المستخدم الحالي")) {
            console.log("Logged-in", that.$refs);
            that.$refs.child1.setNewForceList(that.ids);
          }
        }
      };
      xhttp.onerror = function(error) {
        console.log("Error");
        console.log(error);
        that.showError(error);
      };
      xhttp.timeout = 5000;
      xhttp.ontimeout = function(error) {
        console.log("Timeout");
        console.log(error);

        console.log(`سيتم إعادة نفس العملية بعد: ${2000 / 1000} ثانية`);
        setTimeout(() => {
          that.login(token, index);
        }, 2000);
      };
      xhttp.open("post", "http://1.33.1.150/segelat/Home/Login", true);
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send(
        `UserName=${username}&Password=${password}&__RequestVerificationToken=${token}`
      );
    },

    setOperationErrors(operationErrors) {
      for (let i = 0; i < operationErrors.length; i++) {
        operationErrors[i].operation_errors = operationErrors[i].errors.split(
          " --||-- "
        );
      }
      this.$set(this.errors, "items", operationErrors);
    },
    async init() {
      this.addFunctionsToControl();
    },
    addFunctionsToControl() {
      this.$set(this.controlOp.functions, "isStopped", this.isStopped);
      this.$set(
        this.controlOp.functions,
        "repeatCurrentOpAfter",
        this.repeatCurrentOpAfter
      );
    },
    runOperation(method) {
      this[method]();
    }
  }
};
</script>
