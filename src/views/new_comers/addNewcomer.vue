<template>
  <div tabindex="0" class="no-focus">
    <template v-for="(group, i) in groups">
      <v-card
        v-if="filterItemsForType(group.items).length > 0"
        class="mb-8"
        :key="i"
      >
        <v-card-title
          class="primary white--text"
          v-text="group.title"
        ></v-card-title>
        <v-card-subtitle v-text="group.desc"></v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(item, ii) in filterItemsForType(group.items)">
              <v-col
                v-if="(isEnhaa && item.forEnhaa) || !isEnhaa"
                :key="ii"
                cols="6"
                lg="4"
                xl="3"
              >
                <v-text-field
                  v-model="conscripte[item.model]"
                  v-if="!item.type || ['text', 'date'].includes(item.type)"
                  :type="item.type == 'date' ? 'date' : 'text'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :counter="item.counter"
                  filled
                  :loading="
                    item.model == 'ID' && findingConscripte ? true : false
                  "
                  @keyup.enter="findConscripte()"
                  :readonly="item.readonly"
                ></v-text-field>
                <trible-num
                  v-else-if="item.type == 'tribleNum'"
                  :model="conscripte[item.model]"
                  @updateValue="updateValue"
                >
                </trible-num>

                <v-file-input
                  v-model="conscripte[item.model]"
                  v-if="item.type == 'file'"
                  :label="item.label"
                  accept="image/png, image/jpeg, image/bmp, image/jpg"
                  prepend-icon="mdi-camera"
                  show-size
                  truncate-length="14"
                ></v-file-input>
                <v-textarea
                  v-model="conscripte[item.model]"
                  v-else-if="item.type == 'textarea'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :counter="item.counter"
                  filled
                  :readonly="item.readonly"
                  :disabled="item.readOnly"
                ></v-textarea>
                <v-autocomplete
                  v-model="conscripte[item.model]"
                  :loading="
                    selects &&
                    selects[item.model] &&
                    selects[item.model].loading
                      ? selects[item.model].loading
                      : false
                  "
                  :readonly="item.readonly"
                  v-else-if="item.type == 'select'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :items="
                    selects && selects[item.model] && selects[item.model].data
                      ? selects[item.model].data
                      : []
                  "
                  :item-text="
                    selects && selects[item.model] && selects[item.model].text
                      ? selects[item.model].text
                      : 'text'
                  "
                  :item-value="
                    selects && selects[item.model] && selects[item.model].value
                      ? selects[item.model].value
                      : 'value'
                  "
                  filled
                  :error-messages="
                    selects && selects[item.model] && selects[item.model].error
                      ? selects[item.model].error
                      : ''
                  "
                  :disabled="item.readOnly"
                ></v-autocomplete>
                <v-combobox
                  v-model="conscripte[item.model]"
                  :error-messages="
                    selects && selects[item.model] && selects[item.model].error
                      ? selects[item.model].error
                      : ''
                  "
                  :loading="
                    selects &&
                    selects[item.model] &&
                    selects[item.model].loading
                      ? selects[item.model].loading
                      : false
                  "
                  :readonly="item.readonly"
                  v-else-if="item.type == 'combobox'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :items="
                    selects && selects[item.model] && selects[item.model].data
                      ? selects[item.model].data
                      : []
                  "
                  :item-text="
                    selects && selects[item.model] && selects[item.model].text
                      ? selects[item.model].text
                      : 'text'
                  "
                  :item-value="
                    selects && selects[item.model] && selects[item.model].value
                      ? selects[item.model].value
                      : 'value'
                  "
                  filled
                ></v-combobox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <v-btn
      style="position: fixed; top: 10px; left: 400px; z-index: 999"
      class="px-4"
      large
      color="primary"
      @click="addConscripte()"
    >
      <v-icon class="me-3">mdi-plus</v-icon>
      حفظ الفرد
    </v-btn>
    <v-dialog persistent scrollable max-width="200" v-model="loading">
      <v-card height="150">
        <v-layout align-center align-content-center justify-center fill-height>
          <div>
            <div>
              <v-progress-circular
                indeterminate
                color="primary"
                size="65"
              ></v-progress-circular>
            </div>
            <div class="mt-6">
              جارِ التحميل
            </div>
          </div>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { thisExpression } from "@babel/types";

const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "add_conscripte",
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == "add_conscripte"
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    findingConscripte: false,
    conscripte: {
      Type: constants.serviceTypesMap.solider,
      DutyID: 0,
      Status: "مستجد بالمركز",
      SoldierLevel: "جندي",
      SoldierCategory: "صف"
    },
    isEnhaa: false,
    groups: [
      {
        title: "بيانات تجنيدية",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "ID",
            label: "الرقم العسكري",
            type: "text",
            counter: 13,
            forEnhaa: true
          },
          {
            model: "Name",
            label: "الإسم الكامل",
            type: "text",
            forEnhaa: true
          },
          {
            model: "TripleNo",
            label: "الرقم الثلاثي",
            type: "tribleNum"
          },
          {
            model: "KnowledgeLevel",
            label: "المؤهل",
            type: "select"
          },
          {
            model: "College",
            label: "الكلية ",
            type: "select"
          },
          {
            model: "Specialization",
            label: "التخصص ",
            type: "select"
          },
          {
            model: "Job",
            label: "المهنة ",
            type: "text"
          },
          {
            model: "RecuTreat",
            label: "المعاملة التجنيدية",
            type: "select"
          },
          {
            model: "Address",
            label: "العنوان المدني",
            type: "textarea"
          },
          {
            model: "RelevantTELE",
            label: "رقم تلفون الاقارب",
            type: "text",
            counter: 11
          },
          {
            model: "BloodType",
            label: "فصيلة الدم",
            type: "select"
          },

          {
            model: "Religion",
            label: "الديانة",
            type: "select"
          },

          {
            model: "IdentityNo",
            label: "الرقم القومي",
            type: "text",
            counter: 14
          }

          // {
          //   model: "SoldierStatus",
          //   label: "سبب الانهاء",
          //   type: "select",
          //   forEnhaa: true,
          //   readonly: true
          // },
          // {
          //   model: "RatebState",
          //   label: "سبب الانهاء",
          //   type: "select",
          //   readonly: true
          // },
          //
          // {
          //   model: "EndingCause",
          //   label: "ملاحظة الإنهاء",
          //   readonly: true,
          //
          //   type: "text"
          // },
          // { model: "Namat",
          //   label: "ملاحظة الانهاء",
          //   type: "text" },

          // {
          //   model: "MissingTime",
          //   label: "مدة الفاقدة",
          //   type: "text"
          // },
        ]
      },
      {
        title: "بيانات تجنيدية للكل",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "Status",
            label: "حالة الفرد",
            type: "select",
            readOnly: true
          },
          {
            model: "RecuStage",
            label: "المرحلة التجنيدية",
            type: "select"
          },
          {
            model: "Type",
            label: "توع المجند",
            type: "select",
            readOnly: true
          },
          {
            model: "SoldierLevel",
            label: "الدرجة",
            type: "select",
            readOnly: true
          },
          {
            model: "SoldierCategory",
            label: "الفئة",
            type: "select",
            readOnly: true
          }
        ]
      },
      {
        title: "بيانات تجنيدية اضافية",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "IndexNo",
            label: "رقم السجل ",
            type: "text"
          },

          {
            model: "CentreID",
            label: "المركز",
            type: "select"
          },
          {
            model: "Direction",
            label: " الاتجاه",
            type: "select"
          },
          {
            model: "SoldierTELE",
            label: "رقم التليفون",
            type: "text",
            counter: 11,
            forEnhaa: true
          }
        ]
      },

      {
        title: "مكان الخدمة",
        desc: "",
        items: [
          {
            model: "WeaponID",
            label: "السلاح",
            type: "select"
          },
          {
            model: "UnitID",
            label: "الوحدة",
            type: "select"
          },

          {
            model: "Markez_Tadreb",
            label: " مركز التدريب",
            type: "text",
            readonly: true
          },
          {
            model: "DutyID",
            label: " الواجب المدرب عليه",
            type: "select",
            readonly: true
          }
        ]
      },
      {
        title: "بيانات شخصية",
        desc: "",
        items: [
          {
            model: "BirthDate",
            label: "تاريخ الميلاد",
            type: "date"
          },

          {
            model: "CityID",
            label: "المحافظة",
            type: "select"
          },

          {
            model: "image",
            label: "الصورة الشخصية ",
            type: "file"
          },
          {
            model: "Notes",
            label: "ملاحظات عامة",
            type: "textarea",
            forEnhaa: true
          }
        ]
      },
      {
        title: "بيانات الخدمة",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "RecuStartDate",
            label: "تاريخ التجنيد",
            type: "select",
            forEnhaa: true
          },
          {
            model: "RecuEndDate",
            label: "تاريخ التسريح",
            type: "date"
          },
          {
            model: "ArrivalDate",
            label: " تاريخ الوصول لمركز التدريب",
            type: "date"
          },
          {
            model: "RecuRegion",
            label: "منطقة التجنيد",
            type: "select"
          }
        ]
      }
    ],
    selects: {
      SoldierLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      CurrentJobID: {
        table: "Jobs",
        text: "Name",
        value: "ID_KEY"
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      RecuTreat: {
        text: "text",
        value: "text",
        data: constants.RecuTreat.data
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      DriverLevel: {
        text: "text",
        value: "text",
        data: constants.DriverLevel.data
      },
      BloodType: {
        text: "text",
        value: "text",
        data: constants.BloodType.data
      },
      RecuRegion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      RecuStartDate: {
        table: "RecuStartDates",
        text: "RecuDate",
        value: "RecuDate"
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      Treatment: {
        text: "text",
        value: "text",
        data: constants.Treatment.data
      },
      SoldierStatus: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.endReason
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      College: {
        text: "text",
        value: "text",
        data: constants.College.data
      },
      Direction: {
        text: "Direction",
        value: "Direction",
        table: "Direction"
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      CentreID: {
        table: "Centre",
        text: "Centre",
        value: "CentreID"
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      Duties: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      ServiceType: {
        text: "text",
        value: "text",
        data: constants.serviceTypes
      },
      Type: {
        text: "text",
        value: "text",
        data: [{ text: "راتب عالى" }, { text: "مجند" }]
      },
      ServiceStyle: {
        text: "text",
        value: "text",
        data: constants.ServiceStyle
      },

      MortabatDuties: {
        table: "MortabatDuties",
        text: "Specialization",
        value: "Specialization"
      },

      MartialStatus: {
        text: "text",
        value: "text",
        data: constants.matrialStatus.data
      },
      Specialization: {
        table: "Specialization",
        text: "Specialization",
        value: "Specialization"
      }
    },
    loading: false
  }),
  watch: {
    "conscripte.ID"(v) {
      if (v.length == 14 || v.length < 13) return;

      const levels = {
        1: "متوسطه",
        2: "عليا",
        8: "فوق متوسطة",
        0: "عادة"
      };
      const RecuRegionID = parseInt(v.charAt(4)) - 1;
      const LevelID = parseInt(v.charAt(5));
      const WeaponID = parseInt(v.substr(6, 2));

      this.conscripte.RecuRegion = constants.RecuRegion.data[RecuRegionID].text;
      this.conscripte.KnowledgeLevel = levels[LevelID];
      this.conscripte.IndexNo =
        v.substring(4, 6) + v.substring(8, 10) + v.substring(11, 13);
      this.conscripte.WeaponID = WeaponID || 0;
      this.$set(
        this.conscripte,
        "Markez_Tadreb",
        this.selects.WeaponID.data.find(ele => ele.WeaponID == WeaponID)
          ?.Markez_Tadreb || ""
      );
      this.checkDirection();
      this.checkCity();
    },
    "conscripte.IdentityNo"(v) {
      if (v.length == 14) {
        this.$set(this.conscripte, "BirthDate", this.nationalIdToDate(v));
      }
    },
    "conscripte.RecuStage"(v) {
      this.calculateRecuEndDate();
      this.fetchAvailableStartDates();
    },
    "conscripte.UnitID"(v) {
      this.checkDuties();
    },
    "conscripte.WeaponID"(v) {
      this.checkDuties();
    },
    "conscripte.RecuTreat"(v) {
      this.calculateRecuEndDate();
    },
    "conscripte.KnowledgeLevel"(v) {
      this.calculateRecuEndDate();
      this.fetchAvailableStartDates();
    },
    "conscripte.RecuStartDate"(v) {
      this.conscripte.RecuStartDate = v;
    },
    "conscripte.CentreID"() {
      let Centre = this.selects.CentreID.data.find(
        ele => ele.CentreID == this.conscripte.CentreID
      );
      let City = this.selects.CityID.data.find(
        ele => ele.CityID == Centre.CityID
      );
      this.conscripte.CityID = City.CityID;
      this.checkDirection();
      this.checkCity();
    }
  },
  methods: {
    checkDirection() {
      console.log(this.conscripte.KnowledgeLevel, this.conscripte.CityID);
      if (this.conscripte.KnowledgeLevel && this.conscripte.CityID) {
        this.conscripte.Direction = this.selects.Direction.data.find(
          direction => {
            return (
              direction.KnowledgeLevel == this.conscripte.KnowledgeLevel &&
              direction.City == this.conscripte.CityID
            );
          }
        )?.Direction;
      }
    },
    checkCity() {
      if (this.conscripte.RecuRegion && this.conscripte.CityID) {
        let res = this.selects.Direction.data.find(
          ele =>
            ele.KnowledgeLevel == this.conscripte.KnowledgeLevel &&
            this.conscripte.CityID == ele.City
        );
        if (!res) {
          this.showError(
            "هذا الرقم الثلاثي مرتبط بمركز غير مرتبط ب منطة التنجيد"
          );
          this.conscripte.CityID = null;
          this.conscripte.CentreID = null;
        }
      }
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, text, value } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          // obj.attrs = [text, value];
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              if (table === "Unit")
                this.$set(
                  this.selects[key],
                  "data",
                  x.data.filter(ele => ele.statue == "بالخدمة")
                );
              else if (table === "Duty")
                this.$set(
                  this.selects[key],
                  "data",
                  x.data.filter(ele => !ele.isDeleted)
                );
              else this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              this.handleError(error);
              this.$set(
                this.selects[key],
                "error",
                "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        }
      });
    },
    calculateRecuEndDate() {
      if (
        this.conscripte.RecuStage &&
        this.conscripte.RecuTreat &&
        this.conscripte.KnowledgeLevel
      ) {
        let incrementInYear = 0;
        let incrementInMonth = 0;
        if (this.conscripte.KnowledgeLevel == "متوسطه")
          incrementInYear = incrementInYear + 2;
        if (this.conscripte.KnowledgeLevel == "عليا")
          incrementInYear = incrementInYear + 1;
        if (this.conscripte.KnowledgeLevel == "فوق متوسطة")
          incrementInYear = incrementInYear + 1;
        if (this.conscripte.KnowledgeLevel == "عادة")
          incrementInYear = incrementInYear + 3;

        if (this.conscripte.RecuStage.split("-")[0] == "الاولي")
          incrementInMonth = incrementInMonth + 3;
        if (this.conscripte.RecuStage.split("-")[0] == "الثانية")
          incrementInMonth = incrementInMonth + 6;
        if (this.conscripte.RecuStage.split("-")[0] == "الثالثة")
          incrementInMonth = incrementInMonth + 9;
        if (this.conscripte.RecuStage.split("-")[0] == "الرابعة")
          incrementInMonth = incrementInMonth + 12;

        if (this.conscripte.KnowledgeLevel == "فوق متوسطة")
          incrementInMonth = incrementInMonth + 6;

        if (this.conscripte.RecuTreat == "سنة غير قابلة للرفع")
          incrementInMonth = incrementInMonth + 2;

        if (incrementInMonth > 12) {
          incrementInMonth = incrementInMonth - 12;
          incrementInYear = incrementInYear + 1;
        }

        let year =
          parseInt(this.conscripte.RecuStage.split("-")[1], 10) +
          incrementInYear;
        let month = 0 + incrementInMonth;

        this.conscripte.RecuEndDate = `${year}-${
          month < 10 ? "0" + month : month
        }-01`;
      }
    },
    updateValue(v) {
      this.conscripte.TripleNo = v;
      let splittedValue = v.split("-");
      if (v.split("-").length == 3) {
        this.$set(
          this.conscripte,
          "CentreID",
          this.selects.CentreID.data.find(
            ele => ele.CentreID == splittedValue[1]
          )?.CentreID || 0
        );
        this.$set(
          this.conscripte,
          "CityID",
          this.selects.CityID.data.find(
            ele =>
              ele.CityID ==
                this.selects.CentreID.data.find(
                  ele => ele.CentreID == splittedValue[1]
                )?.CityID || 0
          )?.CityID || 0
        );
      }
    },
    async fetchAvailableStartDates() {
      if (this.conscripte.RecuStage && this.conscripte.KnowledgeLevel) {
        let data = await this.api("global/get_all", {
          table: "RecuStartDates",
          where: {
            KnowledgeLevel: this.conscripte.KnowledgeLevel,
            RecuStage: this.conscripte.RecuStage
          }
        });
        if (data.data.length > 0) {
          this.selects.RecuStartDate.data = data.data;
          this.conscripte.RecuStartDate = data.data[0].RecuDate;
        }
      }
    },

    checkDuties() {
      if (this.conscripte.WeaponID && this.conscripte.UnitID) {
        this.groups[1].items[3].readonly = false;
        const allowedDuties = this.selects.MortabatDuties.data.filter(mEle => {
          const soldierWeapon = this.selects.WeaponID.data.find(
            ele => ele.WeaponID == this.conscripte.WeaponID
          );
          const eleWeapon = this.selects.WeaponID.data.find(
            ele => ele.WeaponID == mEle.WeaponID
          );

          return (
            mEle.UnitID === this.conscripte.UnitID &&
            soldierWeapon?.Weapon === eleWeapon?.Weapon
          );
        });

        this.selects.DutyID.data = this.selects.Duties.data.filter(
          ele =>
            allowedDuties.find(allowed => allowed.DutyID == ele.DutyID) ||
            ele.Duty == "وظيفة غير موجودة في الوحدة"
        );
      } else {
        this.groups[1].items[3].readonly = true;
      }
    },
    toBase64: file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      }),
    async addConscripte() {
      this.$set(this, "loading", true);
      try {
        let conscripte = { ...this.conscripte };
        Object.keys(conscripte).forEach(key => {
          let val = conscripte[key];
          if (val == undefined) {
            conscripte[key] = null;
          }
        });

        if (conscripte.image) {
          conscripte.image = conscripte.image.path;
        }
        if (conscripte.UnitID == null) {
          conscripte.UnitID = 0;
        }
        if (conscripte.DutyID == null) {
          conscripte.DutyID = 0;
        }

        if (!conscripte.ID) {
          this.showError("من فضلك قم بتسجيل الرقم العسكري");
          this.$set(this, "loading", false);
          return;
        }
        if (!conscripte.Name || conscripte.Name.trim().length == 0) {
          this.showError("من فضلك قم بتسجيل اسم الفرد");
          this.$set(this, "loading", false);
          return;
        }

        if (
          this.conscripte.Type === constants.serviceTypesMap.solider &&
          !conscripte.RecuEndDate
        ) {
          this.showError("من فضلك قم باضافة تاريخ التسريح");
          this.$set(this, "loading", false);
          return;
        }

        if (
          this.conscripte.Type === constants.serviceTypesMap.solider &&
          !conscripte.RecuStartDate
        ) {
          this.showError("من فضلك قم باضافة تاريخ بداية التجنيد");
          this.$set(this, "loading", false);
          return;
        }

        if (
          this.conscripte.Type === constants.serviceTypesMap.solider &&
          !conscripte.RecuStage
        ) {
          this.showError("من فضلك قم باضافة المرحلة التجندية");
          this.$set(this, "loading", false);
          return;
        }
        let isExists = false,
          exists = await this.api("global/get_one", {
            table: "Soldier",
            where: {
              ID: conscripte.ID
            }
          });
        if (exists && exists.ok && exists.data && exists.data.ID) {
          isExists = true;
        }
        if (isExists) {
          let addCon = await this.api("global/update_one", {
            table: "Soldier",
            where: {
              ID: conscripte.ID
            },
            update: conscripte
          });
          if (addCon && addCon.ok) {
            this.showSuccess("تم تحديث الفرد بنجاح");
            this.deleteRouteByName("add_conscripte");
          } else {
            this.showError("تعذر تحديث الفرد في قاعدة البيانات");
          }
          this.$set(this, "loading", false);
          return;
        }
        let addCon = await this.api("global/create_one", {
          table: "Soldier",
          where: conscripte
        });

        if (addCon && addCon.ok) {
          this.showSuccess("تم إضافة الفرد بنجاح");
        } else {
          this.showError("تعذر إضافة الفرد في قاعدة البيانات");
        }

        this.conscripte = {
          RecuStage: this.conscripte.RecuStage,
          SoldierCategory: this.conscripte.SoldierCategory,
          SoldierLevel: this.conscripte.SoldierLevel,
          Status: this.conscripte.Status,
          RecuStartDate: this.conscripte.RecuStartDate,
          ArrivalDate: this.conscripte.ArrivalDate,
          DutyID: 0,
          UnitID: 0,
          Type: conscripte.Type
        };
      } catch (error) {
        console.log(error);
      } finally {
        this.$set(this, "loading", false);
      }
    },
    filterItemsForType(items) {
      let ratebCoulmns = [
        "FileNo",
        "RatebCategory",
        "RatebLevel",
        "Directionforunit",
        "RatebState",
        "ServiceStyle",
        "SatrtingSarefRateb",
        "VolunteeringDate",
        "OlderindNo",
        "Qualification",
        "Namat",
        "Taskeen",
        "TahtElTawze3",
        "Dof3aNum",
        "JobBefore",
        "UnitJob",
        "MartialStatus",
        "NumOfChilds",
        "UnitJoinDate",
        "RatebCategoryFari"
      ];

      let soliderCoulmns = [
        "IndexNo",
        "SoldierCategory",
        "SoldierLevel",
        "RecuRegion",
        "RecuStartDate",
        "RecuStage",
        "RecuTreat",
        "MissingTime",
        "RecuEndDate",
        "SoldierStatus",
        "EndingCause",
        "College",
        "Specialization",
        "Job",
        "Direction",
        "Directionforunit",
        "ArrivalDate",
        "Alhaq",
        "TahtEltawze3",
        "BrotherID",
        "ServiceType",
        "GHA",
        "DriverLevel",
        "Treatment",
        "Markez_Tadreb"
      ];
      return this.conscripte.Type == constants.serviceTypesMap.solider
        ? items.filter(ele => ratebCoulmns.indexOf(ele.model) == -1)
        : items.filter(ele => soliderCoulmns.indexOf(ele.model) == -1);
    }
  }
};
</script>
