<template>
  <div @keydown.f12="addConscripte" tabindex="0" class="no-focus">
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
                  :clearable="isAdmin()"
                  :loading="
                    item.model == 'ID' && findingConscripte ? true : false
                  "
                  @keyup.enter="findConscripte()"
                  @keydown.tab="findConscripte()"
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
                  :clearable="isAdmin()"
                  filled
                  :readonly="item.readonly"
                  :disabled="item.readOnly"
                ></v-textarea>
                <v-autocomplete
                  v-model="conscripte[item.model]"
                  :clearable="isAdmin()"
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
                ></v-autocomplete>
                <v-combobox
                  v-model="conscripte[item.model]"
                  :error-messages="
                    selects && selects[item.model] && selects[item.model].error
                      ? selects[item.model].error
                      : ''
                  "
                  :clearable="isAdmin()"
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
    <v-btn
      style="position: fixed; top: 10px; left: 560px; z-index: 999"
      class="px-4"
      large
      outlined
      color="primary"
      @click="emptyFields()"
    >
      جديد
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
  async mounted() {
    // this.fetchAvailbleDates();
    this.init();
    this.selects.RecuEndDate.data =await this.fetchAvailableServiceEndDates();

    if (this.params.id) {
      this.conscripte.ID = this.params.id;
      this.conscripte.Type = this.params.type;
      this.findConscripte();
    }
  },
  data: () => ({
    findingConscripte: false,
    conscripte: {
      Type: constants.serviceTypesMap.solider,
      DutyID: 0,
      Status: "بالخدمة"
    },
    isEnhaa: false,
    availableEndDate: [],
    previousUnit: 0,
    groups: [
      {
        title: "البيانات الأساسية",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "RatebLevel",
            label: "الدرجة",
            type: "select"
          },
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
            model: "Status",
            label: "حالة الفرد",
            type: "select"
          },

          {
            model: "SoldierStatus",
            label: "سبب الانهاء",
            type: "select",
            forEnhaa: true,
            readonly: true
          },
          {
            model: "RatebState",
            label: "سبب الانهاء",
            type: "select",
            readonly: true
          },
          {
            model: "SoldierEndDate",
            label: "تاريخ الانهاء",
            type: "date",
            forEnhaa: true,
            readonly: true
          },
          {
            model: "RatebEndDate",
            label: "تاريخ الانهاء",
            type: "date",
            readonly: true
          },

          {
            model: "SoldierCategory",
            label: "الفئة",
            type: "select"
          },

          {
            model: "DutyID",
            label: " الواجب المدرب عليه",
            type: "select"
          },
          {
            model: "UnitID",
            label: "الوحدة",
            type: "select"
          },

          {
            model: "UnitJoinDate",
            label: "تاريخ الالتحاق بالوحدة",
            type: "date"
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
            model: "Type",
            label: "توع المجند",
            type: "select"
          },
          {
            model: "IndexNo",
            label: "رقم السجل ",
            type: "text"
          },
          {
            model: "SoldierLevel",
            label: "الدرجة",
            type: "select"
          },

          {
            model: "EndingCause",
            label: "ملاحظة الإنهاء",
            readonly: true,

            type: "textarea"
          },
          { model: "Namat", label: "ملاحظة الانهاء", type: "textarea" },

          {
            model: "RecuTreat",
            label: "المعاملة التجنيدية",
            type: "select"
          },
          {
            model: "MissingTime",
            label: "مدة الفاقدة",
            type: "text"
          },

          {
            model: "RecuStage",
            label: "المرحلة التجنيدية",
            type: "select"
          },
          {
            model: "Direction",
            label: " الاتجاه",
            type: "select"
          },
          {
            model: "isChecked",
            label: "تم المراجعة",
            type: "select"
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
            model: "Markez_Tadreb",
            label: " مركز التدريب",
            type: "text",
            readonly: true
          }
        ]
      },
      {
        title: "بيانات شخصية",
        desc: "",
        items: [
          {
            model: "Address",
            label: "العنوان المدني",
            type: "textarea"
          },

          {
            model: "CentreID",
            label: "المركز",
            type: "select"
          },

          {
            model: "CityID",
            label: "المحافظة",
            type: "select"
          },

          {
            model: "IdentityNo",
            label: "الرقم القومي",
            type: "text",
            counter: 14
          },

          {
            model: "BloodType",
            label: "فصيلة الدم",
            type: "select"
          },

          {
            model: "MartialStatus",
            label: "الحالة الاجتماعية",
            type: "select"
          },
          { model: "NumOfChilds", label: "عدد الاطفال", type: "text" },

          {
            model: "KnowledgeLevel",
            label: "المؤهل",
            type: "select"
          },

          {
            model: "BirthDate",
            label: "تاريخ الميلاد",
            type: "date"
          },
          {
            model: "RelevantTELE",
            label: "رقم تلفون الاقارب",
            type: "text",
            counter: 11
          },
          {
            model: "Religion",
            label: "الديانة",
            type: "select"
          },
          {
            model: "SoldierTELE",
            label: "رقم التليفون",
            type: "text",
            counter: 11,
            forEnhaa: true
          },

          {
            model: "Job",
            label: "المهنة ",
            type: "text"
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
          { model: "VolunteeringDate", label: "تاريخ التطوع", type: "date" },

          {
            model: "SatrtingSarefRateb",
            label: "تاريخ صرف الراتب",
            type: "date"
          },

          {
            model: "FirstRenewDateTo",
            label: "تاريخ التجديد الأول",
            type: "date"
          },
          {
            model: "SecondRenewDateTo",
            label: "تاريخ التجديد الثاني",
            type: "date"
          },
          { model: "Dof3aNum", label: "رقم الدفعة", type: "text" },

          {
            model: "RecuStartDate",
            label: "تاريخ التجنيد",
            type: "select",
            forEnhaa: true
          },
          {
            model: "RecuEndDate",
            label: "تاريخ التسريح",
            type: "select"
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
      },
      {
        title: "الإدارات التخصصية",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "Treatment",
            label: "المعاملة",
            type: "select"
          },
          {
            model: "DriverLevel",
            label: "درجة الرخصة",
            type: "select"
          },
          {
            model: "ServiceType",
            label: "نوع الخدمة",
            type: "select"
          }
        ]
      },
      {
        title: "بيانات الراتب العالي",
        desc: "",
        items: [
          { model: "FileNo", label: "رقم الملف", type: "text" },
          { model: "RatebCategory", label: "الفئة", type: "select" },
          { model: "Directionforunit", label: "الاتجاة", type: "text" },
          { model: "UnitJob", label: "العمل بالوحدة", type: "select" },
          { model: "CurrentJobID", label: "العمل الحالي", type: "select" },
          { model: "ServiceStyle", label: "نوع الخدمة", type: "select" },
          { model: "OlderindNo", label: "رقم الاقدمية", type: "text" },
          { model: "Qualification", label: "المؤهل", type: "text" },
          { model: "JobBefore", label: "الوظيفة", type: "text" },
          { model: "RatebCategoryFari", label: "الفئة الفرعية", type: "select" }
        ]
      }
    ],
    selects: {
      isChecked: {
        text: "text",
        value: "text",
        data: ["نعم", "لا"]
      },
      SoldierLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      UnitJob: {
        table: "Jobs",
        text: "Name",
        value: "Name"
      },
      CurrentJobID: {
        table: "Jobs",
        text: "Name",
        value: "ID_KEY"
      },
      FirstRenew: {
        value: "value",
        text: "text",
        data: [
          {
            text: "لا",
            value: 0
          },
          {
            text: "نعم",
            value: 1
          }
        ]
      },
      SecondRenew: {
        text: "text",
        value: "value",
        data: [
          {
            text: "لا",
            value: 0
          },
          {
            text: "نعم",
            value: 1
          }
        ]
      },
      KnowledgeLevel: {
        value: "text",
        text: "text",
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
        text: "Reason",
        value: "Reason",
        table: "EndingReasons"
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
      RatebCategoryFari: {
        text: "text",
        value: "text",
        data: constants.RatebCategoryFari.data
      },
      RatebCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      MortabatDuties: {
        table: "MortabatDuties",
        text: "Specialization",
        value: "Specialization"
      },
      RecuStartDate: {
        table: "RecuStartDates",
        text: "RecuDate",
        value: "RecuDate"
      },
      RatebLevel: {
        text: "text",
        value: "text",
        data: constants.ratebLevels
      },
      RatebState: {
        text: "Reason",
        value: "Reason",
        table: "EndingReasons"
      },
      RecuEndDate: {
        text: "text",
        value: "text",
        data: []
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
    async "params.id"(v) {
      if (v) {
        this.$forceUpdate();
        this.init();
        this.selects.RecuEndDate.data = await this.fetchAvailableServiceEndDates();

        if (this.params.id) {
          this.conscripte.ID = this.params.id;
          this.conscripte.Type = this.params.type;
          await this.findConscripte();
        }
      }
    },
    "conscripte.ID"(v) {
      if (v.length == 14) return;

      const levels = {
        1: "متوسطه",
        2: "عليا",
        8: "فوق متوسطة",
        0: "عادة"
      };
      const WeaponID = parseInt(v.substr(6, 2));

      if(    this.conscripte.Type === constants.serviceTypesMap.solider){
        const RecuRegionID = parseInt(v.charAt(4)) - 1;
        const LevelID = parseInt(v.charAt(5));
        this.conscripte.KnowledgeLevel = levels[LevelID];

        this.conscripte.RecuRegion = constants.RecuRegion.data[RecuRegionID].text;
      }
      this.conscripte.IndexNo =
        v.substring(4, 6) + v.substring(8, 10) + v.substring(11, 13);
      this.checkDirection();
      if (WeaponID) {
        this.conscripte.WeaponID = WeaponID;
      }
      this.$set(
        this.conscripte,
        "Markez_Tadreb",
        this.selects.WeaponID.data.find(ele => ele.WeaponID == WeaponID)
          ?.Markez_Tadreb || ""
      );
      this.checkDirection();
      this.checkCity();
    },
    "conscripte.CityID"() {
      this.checkDirection();
    },
    "conscripte.Status"(v) {
      this.$confirm(`هل انت متاكد من تغير حالة الفرد`, {
        title: ``
      });
      if (v == "منتهى خدمته") {
        this.groups[0].items.forEach(ele => {
          if (
            [
              "SoldierStatus",
              "RatebState",
              "SoldierEndDate",
              "RatebEndDate",
              "EndingCause",
              "Namat"
            ].indexOf(ele.model) > -1
          )
            ele.readonly = false;
        });
      }
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
    "conscripte.RatebCategory"(v) {
      this.checkDuties();
    },
    "conscripte.SoldierCategory"(v) {
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
    }
  },
  methods: {
    checkDirection() {
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
    async fetchAvailableStartDates() {
      if (this.conscripte.RecuStage && this.conscripte.KnowledgeLevel) {
        let data = await this.api("global/get_all", {
          table: "RecuStartDates",
          where: {
            KnowledgeLevel: this.conscripte.KnowledgeLevel,
            RecuStage: this.conscripte.RecuStage
          }
        });
        console.log(data);
        this.selects.RecuStartDate.data = data.data;
      }
    },

    emptyFields(exeptId = false) {
      this.$set(this, "conscripte", {
        conscriptionDate: null,
        unitID: null,
        militaryId: exeptId ? this.conscripte.militaryId : null,
        DutyID: 0,
        UnitID: 0,
        SoldierStatus: "بالخدمة"
      });
    },
    async findConscripte() {
      let { ID } = this.conscripte,
        type = this.conscripte.Type,
        groupItems = this.groups.map(g => g.items),
        models = [];
      groupItems.forEach(gitems => {
        let item_models = gitems.map(g => g.model);
        models = [...models, ...item_models];
      });
      if (!ID || ID.length == 0) {
        return;
      }
      this.$set(this, "findingConscripte", true);

      let conscripte = await this.api("global/get_one", {
        table: type === constants.serviceTypesMap.solider ? "Soldier" : "Rateb",
        where: {
          ID
        }
      });
      if (
        conscripte &&
        conscripte.ok &&
        conscripte.data &&
        conscripte.data.ID
      ) {
        let data = this.fixDates(
          [conscripte.data],
          [
            "conscriptionDate",
            "demobilizationDate",
            "endingDutyDate",
            "demobilizationDateStarter",
            "birthDate"
          ]
        )[0];
        this.previousUnit = data.UnitID;
        console.log("previous unit is", this.previousUnit);
        data.DutyID = parseInt(data.DutyID);
        models.forEach(model => {
          this.$set(this.conscripte, model, data[model]);
        });
        this.conscripte.Type = type;
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
        this.checkCity();
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
    checkDuties() {
      this.selects.DutyID.data = [];
      if (!this.selects.MortabatDuties.data) {
        setTimeout(() => {
          this.checkDuties();
        }, 1000);
        return;
      }

      if (
        this.conscripte.WeaponID &&
        this.conscripte.UnitID &&
        (this.conscripte.RatebCategory || this.conscripte.SoldierCategory)
      ) {
        // this.groups[0].items[9].readonly = false;
        const allowedDuties = this.selects.MortabatDuties.data.filter(mEle => {
          const soldierWeapon = this.selects.WeaponID.data.find(
            ele => ele.WeaponID == this.conscripte.WeaponID
          );
          const eleWeapon = this.selects.WeaponID.data.find(
            ele => ele.WeaponID == mEle.WeaponID
          );

          return (
            mEle.UnitID === this.conscripte.UnitID &&
            soldierWeapon?.Weapon === eleWeapon?.Weapon &&
            (this.conscripte.RatebCategory
              ? mEle.Category === this.conscripte.RatebCategory
              : mEle.Category === this.conscripte.SoldierCategory)
          );
        });

        this.selects.DutyID.data = this.selects.Duties.data.filter(
          ele =>
            allowedDuties.find(allowed => allowed.DutyID == ele.DutyID) ||
            ele.Duty == "وظيفة غير موجودة في الوحدة"
        );
      } else {
        // this.groups[0].items[9].readonly = true;
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
        if (
          !this.$store.state.currentUser.canEditRateb &&
          this.conscripte.Type === constants.serviceTypesMap.highLevel
        ) {
          this.showError("غير مسموح لك بتغير او اضافة راتب عالي");
          return;
        }
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
          this.conscripte.Type === constants.serviceTypesMap.highLevel &&
          !conscripte.RatebCategory
        ) {
          this.showError("من فضلك قم باضافة فئة");
          this.$set(this, "loading", false);
          return;
        }
        if (
          this.conscripte.Type === constants.serviceTypesMap.highLevel &&
          !conscripte.VolunteeringDate
        ) {
          this.showError("من فضلك قم باضافة تاريخ التطوع");
          this.$set(this, "loading", false);
          return;
        }
        if (
          this.conscripte.Type === constants.serviceTypesMap.highLevel &&
          !conscripte.SatrtingSarefRateb && !conscripte.RatebLevel.includes("طالب")
        ) {
          this.showError("من فضلك قم باضافة تاريخ صرف الراتب العالي");
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
          !conscripte.RecuTreat
        ) {
          this.showError("من فضلك قم باضافة معاملة تجنيدية");
          this.$set(this, "loading", false);
          return;
        }
        if (
          this.conscripte.Type === constants.serviceTypesMap.solider &&
          !conscripte.SoldierCategory
        ) {
          this.showError("من فضلك قم باضافة فئة");
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
            table:
              this.conscripte.Type === constants.serviceTypesMap.solider
                ? "Soldier"
                : "Rateb",
            where: {
              ID: conscripte.ID
            }
          });
        if (exists && exists.ok && exists.data && exists.data.ID) {
          isExists = true;
        }
        if (isExists) {
          let addCon = await this.api("global/update_one", {
            table:
              this.conscripte.Type === constants.serviceTypesMap.solider
                ? "Soldier"
                : "Rateb",
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
          console.log("Exist", exists);
          console.log("Conscripte", conscripte);

          if (
            this.previousUnit != conscripte.UnitID &&
            conscripte.Status == "بالخدمة"
          ) {
            await this.api("global/create_one", {
              table: "UnitEffecs",
              where: {
                UnitID: conscripte.UnitID,
                ID: conscripte.ID,
                increment: true,
                date: new Date(),
                type:
                  this.conscripte.Type === constants.serviceTypesMap.solider
                    ? "Soldier"
                    : "Rateb",
                descrption : `تم اضافة ${conscripte.Type} الى الوحدة ونقله من وحدة ${this.selects.UnitID.data.find(ele => ele.UnitID == this.previousUnit).Unit}`

                // descrption: `تمت إضافة ${conscripte.Type} الى الوحدة واضافته الى المنظومة  من البداية`
              }
            });
            if (this.previousUnit != 0) {
              await this.api("global/create_one", {
                table: "UnitEffecs",
                where: {
                  UnitID: this.previousUnit,
                  ID: conscripte.ID,
                  increment: false,
                  date: new Date(),
                  type:
                    this.conscripte.Type === constants.serviceTypesMap.solider
                      ? "Soldier"
                      : "Rateb",
                  descrption : `تم شطب ${conscripte.Type}  من الوحدة ونقله الى وحدة  ${this.selects.UnitID.data.find(ele => ele.UnitID == conscripte.UnitID).Unit}`

                  // descrption: `تمت حذف ${conscripظte.Type} برقم عسكري ${conscripte.ID} من الوحدة و نقله الى وحدة اخرى`
                }
              });
            }
          } else if (conscripte.UnitID && conscripte.Status != "بالخدمة") {
            await this.api("global/create_one", {
              table: "UnitEffecs",
              where: {
                UnitID: conscripte.UnitID,
                ID: conscripte.ID,
                increment: false,
                date: new Date(),
                type:
                  this.conscripte.Type === constants.serviceTypesMap.solider
                    ? "Soldier"
                    : "Rateb",

                descrption: `تم شطب ${this.conscripte.Type} من الوحدة بسبب انتهاء خدمته بسبب (${this.conscripte.Type === constants.serviceTypesMap.solider ? conscripte.SoldierStatus : conscripte.RatebState})`


                // descrption: `تمت حذف ${conscripte.Type} برقم عسكري ${conscripte.ID}  من الوحدة بسبب خروجه من الخدمة`
              }
            });
          }

          return;
        }
        let addCon = await this.api("global/create_one", {
          table:
            this.conscripte.Type === constants.serviceTypesMap.solider
              ? "Soldier"
              : "Rateb",
          where: conscripte
        });

        if (conscripte.UnitID && conscripte.Status == "بالخدمة") {
          await this.api("global/create_one", {
            table: "UnitEffecs",
            where: {
              UnitID: conscripte.UnitID,
              ID: conscripte.ID,
              increment: true,
              date: new Date(),
              type:
                this.conscripte.Type === constants.serviceTypesMap.solider
                  ? "Soldier"
                  : "Rateb",
              descrption: `تمت اضافة ${this.conscripte.Type} الى الوحدة و اضافته بشكل جديد الى المنظومة`
            }
          });
        }

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
        this.handleError(error);
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
        "isChecked",
        "RatebState",
        "RatebEndDate",
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
        "FirstRenewDateTo",
        "SecondRenewDateTo",
        "CurrentJobID",
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
        "SoldierEndDate",
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
