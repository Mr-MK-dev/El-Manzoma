<template>
  <div tabindex="0" class="no-focus profile">
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
                  :label="item.label"
                  filled
                  v-if="item.type == 'text'"
                  disabled
                  outlined
                ></v-text-field>

                <v-card v-if="item.type == 'image'">
                  <v-card-title class="text-h6">
                    {{ item.label }}
                  </v-card-title>
                  <v-img
                    :lazy-src="conscripte[item.model]"
                    max-height="300"
                    contain
                    max-width="250"
                    :src="conscripte[item.model]"
                  ></v-img>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
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

<style>
.profile .v-input__slot {
  background: none !important;
}
.profile .v-label {
  color: #000 !important;
  font-size: 16px !important;
}
.profile
  .theme--light.v-text-field--outlined:not(.v-input--is-focused).v-input--is-disabled
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: var(--v-primary-base) !important;
}

.theme--light.v-input input,
.theme--light.v-input textarea {
  color: rgba(0, 0, 0, 0.87) !important ;
}

.profile .v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}
</style>
<script>
const constants = require("../../../../../../../Constant").default;
const _ = require("lodash");
export default {
  name: "new-profile",
  props: {
    conscripteObJ: {
      type: Object,
      default: () => {}
    }
  },
  async mounted() {
    this.conscripte = {
      ...this.conscripteObJ,
      weapon: (this.conscripteObJ.Weapon || {}).Weapon,
      Markez_Tadreb: (this.conscripteObJ.Weapon || {}).Markez_Tadreb,
      unit: (this.conscripteObJ.Unit || {}).Unit,
      UnitJob: (this.conscripteObJ.Job || {}).Name,
      duty: (this.conscripteObJ.Duty || {}).Duty,
      centre: (this.conscripteObJ.Centre || {}).Centre,
      CurrentJob: (this.conscripteObJ.Job || {}).Name,
      SecondRenew: this.conscripteObJ.SecondRenew ? "نعم" : "لا",
      FirstRenew: this.conscripteObJ.FirstRenew ? "نعم" : "لا",
      city: (this.conscripteObJ.City || {}).City,
      cardWapper: (this.conscripteObJ.inventoryLevelups || [])[0]?.hafza,
      image: (
        await this.api("global/load-image", {
          path: constants.imagePath + this.conscripteObJ.ID + ".png"
        })
      ).data
    };
  },
  data: () => ({
    findingConscripte: false,
    conscripte: {
      conscriptionDate: null,
      unitID: null
    },
    isEnhaa: false,
    groups: [
      {
        title: "البيانات الأساسية",
        desc: "",
        forEnhaa: true,
        items: [
          { model: "RatebLevel", label: "الدرجة", type: "text" },

          {
            model: "ID",
            label: "الرقم العسكري",
            type: "text",
            readonly: true
          },
          {
            model: "Name",
            label: "الإسم الكامل",
            type: "text",
            readonly: true
          },
          {
            model: "TripleNo",
            label: "الرقم الثلاثي",
            type: "text",
            readonly: true
          },
          {
            model: "Status",
            label: "حالة الفرد",

            type: "text",
            readonly: true
          },
          {
            model: "RatebState",
            label: " سبب الإنهاء",
            type: "text"
          },

          {
            model: "SoldierStatus",
            label: "سبب الانهاء",
            type: "text"
          },
          {
            model: "RatebEndDate",
            label: " تاريخ الإنهاء",
            type: "text"
          },

          {
            model: "SoldierEndDate",
            label: "تاريخ الانهاء",
            type: "text"
          },
          { model: "RatebCategory", label: "الفئة", type: "text" },
          { model: "SoldierCategory", label: "الفئة", type: "text" },

          {
            model: "duty",
            label: " الواجب المدرب عليه",
            type: "text",
            readonly: true
          },
          { model: "UnitJob", label: "العمل في الوحدة", type: "text" },

          {
            model: "unit",
            label: "الوحدة",
            type: "text",
            readonly: true
          },

          {
            model: "UnitJoinDate",
            label: "تاريخ الالتحاق بالوحدة",
            type: "text"
          },
          {
            model: "Type",
            label: "توع المجند",
            type: "text"
          },

          {
            model: "IndexNo",
            label: "رقم السجل ",
            type: "text",
            readonly: true
          },
          {
            model: "SoldierLevel",
            label: "الدرجة",
            type: "text",
            readonly: true
          },

          {
            model: "EndingCause",
            label: "ملاحظة الإنهاء",
            type: "text",
            readonly: true
          },
          {
            model: "KnowledgeLevel",
            label: "المؤهل",
            type: "text",
            readonly: true
          },

          {
            model: "RecuTreat",
            label: "المعاملة التجنيدية",
            type: "text",
            readonly: true
          },
          {
            model: "MissingTime",
            label: "مدة الفاقدة",
            type: "text",
            readonly: true
          },

          {
            model: "RecuStage",
            label: "المرحلة التجنيدية",
            type: "text",
            readonly: true
          },
          {
            model: "Direction",
            label: " الاتجاه",
            type: "text",
            readonly: true
          },
          {
            model: "isChecked",
            label: "تم المراجعة",
            type: "text"
          }
        ]
      },
      {
        title: "بيانات شخصية",
        desc: "",
        items: [
          {
            model: "centre",
            label: "المركز",
            type: "text",
            counter: 11,
            readonly: true
          },

          {
            model: "city",
            label: "المحافظة",
            type: "text",
            counter: 11
          },

          {
            model: "IdentityNo",
            label: "الرقم القومي",
            type: "text",
            readonly: true
          },

          {
            model: "BloodType",
            label: "فصيلة الدم",
            type: "text",
            counter: 11,
            readonly: true
          },
          { model: "MartialStatus", label: "الحالة الاجتماعية", type: "text" },
          { model: "NumOfChilds", label: "عدد الاطفال", type: "text" },
          { model: "Qualification", label: "المؤهل", type: "text" },

          {
            model: "BirthDate",
            label: "تاريخ الميلاد",
            type: "text",
            readonly: true
          },

          {
            model: "RelevantTELE",
            label: "رقم تلفون الاقارب",
            type: "text",
            readonly: true
          },
          {
            model: "Religion",
            label: "الديانة",
            type: "text",
            counter: 11,
            readonly: true
          },
          {
            model: "SoldierTELE",
            label: "رقم التليفون",
            type: "text",
            readonly: true
          },
          {
            model: "Address",
            label: "العنوان المدني",
            type: "text",
            readonly: true
          },
          {
            model: "Job",
            label: "المهنة ",
            type: "text",
            readonly: true
          },

          {
            model: "College",
            label: "الكلية",
            type: "text",
            counter: 11,
            readonly: true
          },
          {
            model: "Specialization",
            label: "التخصص ",
            type: "text",
            readonly: true
          },
          {
            model: "image",
            label: "الصورة الشخصية",
            type: "image"
          }
        ]
      },
      {
        title: "بيانات الخدمة",
        desc: "",
        forEnhaa: true,
        items: [
          { model: "VolunteeringDate", label: "تاريخ التطوع", type: "text" },

          {
            model: "SatrtingSarefRateb",
            label: "تاريح صرف الراتب",
            type: "text"
          },

          {
            model: "FirstRenewDateTo",
            label: "تاريخ التجديد الأول",
            type: "text"
          },
          {
            model: "SecondRenewDateTo",
            label: "تاريخ التجديد الثاني",
            type: "text"
          },
          { model: "Dof3aNum", label: "رقم الدفعة", type: "text" },

          {
            model: "RecuStartDate",
            label: "تاريخ التجنيد",
            type: "text",
            readonly: true
          },
          {
            model: "RecuEndDate",
            label: "تاريخ التسريح",
            type: "text",
            readonly: true
          },
          {
            model: "RecuRegion",
            label: "منطقة التجنيد",
            type: "text",
            counter: 11
          },
          {
            model: "Notes",
            label: "ملاحظات عامة",
            type: "text",
            forEnhaa: true
          }
        ]
      },

      {
        title: "مكان الخدمة",
        desc: "",
        items: [
          {
            model: "weapon",
            label: "السلاح",
            type: "text",
            readonly: true
          },

          {
            model: "Markez_Tadreb",
            label: " مركز التدريب",
            type: "text",
            readonly: true
          },

          {
            model: "ArrivalDate",
            label: " تاريخ الوصول لمركز التدريب",
            type: "text",
            readonly: true
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
            type: "text"
          },
          {
            model: "DriverLevel",
            label: "درجة الرخصة",
            type: "text"
          },
          {
            model: "ServiceType",
            label: "نوع الخدمة",
            type: "text"
          }
        ]
      },
      {
        title: "بيانات الراتب العالي",
        desc: "",
        items: [
          { model: "FileNo", label: "رقم الملف", type: "text" },
          { model: "Directionforunit", label: "الاتجاة", type: "text" },
          { model: "CurrentJob", label: "العمل الحالي", type: "text" },
          { model: "ServiceStyle", label: "نوع الخدمة", type: "text" },
          { model: "OlderindNo", label: "رقم الاقدمية", type: "text" },
          { model: "Namat", label: "سبب الانهاء", type: "text" },
          { model: "JobBefore", label: "الوظيفة", type: "text" },
          { model: "RatebCategoryFari", label: "الفئة الفرعية", type: "text" },

          { model: "cardWapper", label: "حافظة الكارت", type: "text" }
        ]
      }
    ],

    loading: false
  }),
  watch: {},

  methods: {
    async getBase64FromUrl(url) {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      });
    },
    filterItemsForType(items) {
      let ratebCoulmns = [
        "FileNo",
        "RatebCategory",
        "UnitJob",
        "RatebLevel",
        "Directionforunit",
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
