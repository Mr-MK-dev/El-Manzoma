<template>
  <div>
    <v-dialog
      persistent
      v-model="GradesInternals.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="GradesInternals.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <grades ref="internals" :parentFilters="true"></grades>
        </v-card-text>
      </v-card>
    </v-dialog>
    <editor-dialog-bulider
      :title="'عملية الشطب'"
      :open="showRemoveDialog"
      :loading="addLoading"
      :fields="removeData"
      :data="removedItem"
      @on-close="showRemoveDialog = false"
      @on-submit="removeFromCandidates()"
    >
    </editor-dialog-bulider>

    <v-dialog
      persistent
      v-model="Internals.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn
            @click="
              Internals.model = false;
              this.finalResult = [];
            "
            icon
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <final-result ref="internals" :parentFilters="true"></final-result>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-card-title>
      <v-btn @click="actionAdd()" large outlined color="primary">
        إضافة راتب عالي الى النشرة
      </v-btn>
    </v-card-title>

    <v-tabs show-arrows height="60" slider-size="3" center-active>
      <v-tab
        :active-class="`white--textprimary--text`"
        :class="` ls-0 text-body-1  grey--text`"
        @click="
          findItems();
          showAddedAndRemovedtable = false;
          showMaintable = true;
        "
      >
        الموجود في نشرة التجديدات
      </v-tab>
      <v-tab
        :active-class="`white--textprimary--text`"
        :class="` ls-0 text-body-1  grey--text`"
        @click="
          findAddedItems();
          showAddedAndRemovedtable = true;
          showMaintable = false;
        "
      >
        عرض خطة اضافة
      </v-tab>

      <v-tab
        :active-class="`white--textprimary--text`"
        :class="` ls-0 text-body-1  grey--text`"
        @click="
          findRemovedItems();
          showAddedAndRemovedtable = true;
          showMaintable = false;
        "
      >
        عرض خطة شطب
      </v-tab>
    </v-tabs>

    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            من لا يرغب : {{ totals.Disagree }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            من يرغب : {{ totals.agree }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            عدد الغير لائق : {{ totals.Inappropriate }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            عدد لائق : {{ totals.appropriate }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            من لم يتم التوصية عليهم من قائد الوحدة :
            {{ totals.HaveNotLeaderRecommendation }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            عدد من إجتاز في تقارير الكفاءة :
            {{ totals.Grade }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            عدد من أنتهى من جميع الإجراءات :
            {{ totals.TotalSuccess }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            الإجمالي :
            {{ totals.appropriate + totals.Inappropriate }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-btn
            @click="
              Internals.model = true;
              getInternals();
            "
            color="primary"
          >
            عرض جميع من إنتهى من الإجراءات
          </v-btn>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-btn
            @click="
              updateRenewDates();
              findItems();
            "
            color="primary"
          >
            الأنتهاء من النشرة وتحديث تواريخ التجديد
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <table-bulider
      :headers="mainTable.headers"
      v-if="showMaintable"
      :printer="mainTable.printer"
      :wordFile="'/rateb/renewlistCandidates'"
      :items="mainTable.items"
      :title="
        listType === `all`
          ? 'نشرة التجديدات'
          : listType === `added`
          ? `خطة الاضافة`
          : `خطة الشطب`
      "
      :isExcel="true"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-slot:item.CandidateGrade="{ item }">
        <v-chip
          @click="
            GradesInternals.model = true;
            grades(item);
          "
          :color="item.totalGrade >= 60 ? 'success' : 'error'"
        >
          {{ item.totalGrade }}
        </v-chip>
      </template>
      <template v-slot:item.isHasRecommendation="{ item }">
        <v-chip
          :color="item.isHasRecommendation == 'أوافق' ? 'success' : 'error'"
        >
          {{ item.isHasRecommendation }}
        </v-chip>
      </template>
      <template v-slot:item.isAgree="{ item }">
        <v-chip :color="item.isAgree == 'أرغب' ? 'success' : 'error'">
          {{ item.isAgree }}
        </v-chip>
      </template>
      <template v-slot:item.MedicalSituation="{ item }">
        <v-chip :color="item.MedicalSituation == 'لائق' ? 'success' : 'error'">
          {{ item.MedicalSituation }}
        </v-chip>
      </template>
      <template v-slot:item.RequirementsText="{ item }">
        <v-chip
          :color="item.RequirementsText == 'تم الإستلام' ? 'success' : 'error'"
        >
          {{ item.RequirementsText }}
        </v-chip>
      </template>

      <template v-slot:item.RatebID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.RatebID}`"
          @click.right="copyText(item.RatebID)"
        >
          {{ item.RatebID }}
        </v-chip>
      </template>

      <template v-slot:item.deleteFromList="{ item }">
        <v-chip
          v-if="listType == `all`"
          icon
          color="transparent"
          @click="actionDelete(item)"
        >
          <v-icon color="red">mdi-delete</v-icon>
        </v-chip>
      </template>
    </table-bulider>
    <table-bulider
      :headers="mainTable.headersAddedAndRemoved"
      v-if="showAddedAndRemovedtable"
      :items="mainTable.items"
      :printer="mainTable.printer"
      :title="
        listType === `all`
          ? 'نشرة التجديدات'
          : listType === `added`
          ? `خطة الاضافة`
          : `خطة الشطب`
      "
      :isExcel="true"
    >
      <template v-slot:item.RatebID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.RatebID}`"
          @click.right="copyText(item.RatebID)"
        >
          {{ item.RatebID }}
        </v-chip>
      </template>

      <template v-slot:item.isChecked="{ item }">
        <v-chip @click="actionIsChecked(item, listType)" :color="item.color">
          {{ item.isChecked }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="showAddNewDialog"
      :loading="addLoading"
      :fields="addData"
      :data="addModel"
      :selects="selects"
      @on-close="showAddNewDialog = false"
      @on-submit="addNewToAddPlan()"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="showAddDialog"
      :loading="addLoading"
      :fields="mainTable.headers"
      :data="addModel"
      :selects="selects"
      @on-close="showAddDialog = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../../Constant").default;
export default {
  name: "RenewListDetails",
  components: {
    grades: () => import("@/views/high_level/gradeDetails.vue"),

    finalResult: () =>
      import("@/views/high_level/renew_new/FinalResultFromRenewList")
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

  mounted() {
    this.init();
    this.findItems({});
    console.log(this.$route.params.id);
  },

  data: () => ({
    GradesInternals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    showRemoveDialog: false,
    showAddedAndRemovedtable: false,
    showMaintable: true,
    removedItem: {},

    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    finalResult: [],
    totals: {
      Disagree: 0,
      agree: 0,
      HaveNotLeaderRecommendation: 0,
      Inappropriate: 0,
      appropriate: 0,
      Grade: 0,
      TotalSuccess: 0,
      total: 0
    },
    listType: "all",
    searchLoading: false,
    selects: {
      RatebLevel: {
        data: constants.ratebLevels
      },
      isAgree: {
        text: "text",
        value: "text",
        data: ["أرغب", "لا أرغب"]
      },
      RenewType: {
        text: "text",
        value: "text",
        data: ["التجديد الأول", "التجديد الثاني"]
      },
      isHasRecommendation: {
        text: "text",
        value: "text",
        data: ["أوافق", "لا أوافق"]
      },
      MedicalSituation: {
        text: "text",
        value: "text",
        data: ["لائق", "غير لائق"]
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      RatebCategory: constants.SoldierCategory
    },
    mainTable: {
      headers: [
        {
          text: "",
          value: "editor",
          searchValue: "editor",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "RatebID",
          searchValue: "RatebID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "تاريخ صرف الراتب العالي",
          value: "Rateb.SatrtingSarefRateb",
          searchValue: "SatrtingSarefRateb",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "موافقة الفرد",
          value: "isAgree",
          searchValue: "isAgree",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "توصية قائد الوحدة",
          value: "isHasRecommendation",
          searchValue: "isHasRecommendation",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الموقف الطبي",
          value: "MedicalSituation",
          searchValue: "MedicalSituation",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "متوسط تقرير الكفاءات",
          value: "CandidateGrade",
          searchValue: "CandidateGrade",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "تمام إجراءات الوحدة",
          value: "RequirementsText",
          searchValue: "Requirements",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: false,
          sort: 1
        },
        {
          text: "نوع التجديد",
          value: "RenewType",
          searchValue: "RenewType",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "",
          value: "deleteFromList",
          searchValue: "deleteFromList",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      headersAddedAndRemoved: [
        {
          text: "الرقم العسكري",
          value: "RatebID",
          searchValue: "RatebID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "تاريخ صرف الراتب العالي",
          value: "Rateb.SatrtingSarefRateb",
          searchValue: "SatrtingSarefRateb",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "نوع التجديد",
          value: "RenewType",
          searchValue: "RenewType",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "التأكيد في الهيئة",
          value: "isChecked",
          searchValue: "isChecked",
          sortable: true,
          type: "checkbox",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    removeData: [
      {
        text: "ملاحظات",
        value: "Notes",
        searchValue: "Notes",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "تم التأكيد في الهيئة",
        value: "isChecked",
        searchValue: "isChecked",
        sortable: true,
        type: "checkbox",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    addData: [
      {
        text: "الرقم العسكري",
        value: "RatebID",
        searchValue: "RatebID",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الاسم",
        value: "Rateb.Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: true,
        readOnly: true,
        inTable: true,
        inModel: true,
        readonly: true,
        sort: 1
      },
      {
        text: "نوع التجديد",
        value: "RenewType",
        searchValue: "RenewType",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "ملاحظات",
        value: "Notes",
        searchValue: "Notes",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "التأكيد في الهيئة",
        value: "isChecked",
        searchValue: "isChecked",
        sortable: true,
        type: "checkbox",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    showAddNewDialog: false,
    showAddDialog: false,
    addLoading: false,
    addModel: {}
  }),
  watch: {
    "addModel.RatebID"(newValue) {
      this.findOne(newValue);
    }
  },

  methods: {
    async grades(item) {
      if (this.$refs.internals) {
        this.$refs.internals.mainTable.headers.forEach(function(obj) {});
        this.$refs.internals.gradeDetails.SoliderID = item.RatebID;
        this.$set(this.$refs.internals.gradeDetails, "SoliderID", item.RatebID);

        await this.$refs.internals.findItems({ SoliderID: item.RatebID });
      } else {
        window.setTimeout(async () => {
          await this.grades(item);
        }, 1000);
      }
    },

    actionDelete(item) {
      this.removedItem = item;
      this.$set(this, "showRemoveDialog", true);
    },
    async updateRenewDates() {
      let cand = this.mainTable.items;
      cand = cand.filter(
        ele =>
          ele.totalGrade > 60 &&
          ele.isAgree &&
          ele.isHasRecommendation &&
          ele.Requirements &&
          ele.MedicalSituation
      );
      cand = cand.map(ele => ({
        ...ele,
        lostPeriod: this.calculateLostPeriod(ele, ele.Rateb.FirstRenewDateTo)
      }));
      for (let i = 0; i < cand.length; i++) {
        if (cand[i].RenewType.includes("التجديد الأول")) {
          cand[i] = {
            ...cand[i],
            firstRenewDate: new Date(
              new Date(cand[i].Rateb.SatrtingSarefRateb).setDate(
                new Date(cand[i].Rateb.SatrtingSarefRateb).getDate() +
                  1826 +
                  cand[i].lostPeriod
              )
            )
          };
        } else {
          cand[i] = {
            ...cand[i],
            secondRenewDate: new Date(
              new Date(cand[i].Rateb.FirstRenewDateTo).setDate(
                new Date(cand[i].Rateb.FirstRenewDateTo).getDate() +
                  1826 +
                  cand[i].lostPeriod
              )
            )
          };
        }
      }
      console.log("cand", cand);
      try {
        for (let i = 0; i < cand.length; i++) {
          if (cand[i].RenewType.includes("التجديد الأول")) {
            await this.api(`global/update_one`, {
              table: "Rateb",
              where: { ID: cand[i].RatebID },
              update: { FirstRenewDateTo: cand[i].firstRenewDate }
            });
            await this.api(`global/update_one`, {
              table: "RenewCandidates",
              where: { RatebID: cand[i].RatebID },
              update: { RenewDate: cand[i].firstRenewDate }
            });
          } else {
            await this.api(`global/update_one`, {
              table: "Rateb",
              where: { ID: cand[i].RatebID },
              update: { SecondRenewDateTo: cand[i].secondRenewDate }
            });
            await this.api(`global/update_one`, {
              table: "RenewCandidates",
              where: { RatebID: cand[i].RatebID },
              update: { RenewDate: cand[i].secondRenewDate }
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    calculateLostPeriod(candidate, FirstRenewDate) {
      console.log(candidate);
      let lostPeriod = 0;
      if (candidate.RenewType.includes("التجديد الأول")) {
        if (candidate.RatebPunishments) {
          candidate.RatebPunishments.forEach(pen =>
            (pen?.crimeText?.includes("غياب") && pen.periodInDays > 5) ||
            pen?.kind?.includes("حبس")
              ? (lostPeriod += pen.periodInDays)
              : 0
          );
        }
      } else {
        if (candidate.RatebPunishments) {
          candidate.RatebPunishments.filter(
            ele => new Date(ele.orderDate) > new Date(FirstRenewDate)
          ).forEach(pen =>
            (pen?.crimeText?.includes("غياب") && pen.periodInDays > 5) ||
            pen?.kind?.includes("حبس")
              ? (lostPeriod += pen.periodInDays)
              : 0
          );
        }
      }
      return lostPeriod;
    },
    async getInternals() {
      if (this.$refs.internals) {
        this.$refs.internals.mainTable.items = this.finalResult;
        this.$set(this.$refs.internals.mainTable, "printer", {
          data: this.finalResult,
          excelKey: "data",
          excelHeaders: this.$refs.internals.mainTable.headers.filter(
            f => f.inTable
          )
        });
      } else {
        window.setTimeout(async () => {
          await this.getInternals();
        }, 1000);
      }
    },

    async actionEdit(item) {
      this.findOne(item.RatebID);

      this.$set(this, "showAddDialog", true);

      this.$set(this, "addModel", {
        ...item
      });
    },
    actionIsChecked(item, listType) {
      console.log(item);
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (listType === "added") {
              let x = await this.api(`global/update_one`, {
                table: "RenewAddPlans",
                where: {
                  RatebID: item.RatebID
                },
                update: {
                  isChecked: item.isChecked === "تم التأكيد في الهيئة" ? 0 : 1
                }
              });
              this.findAddedItems();
            } else if (listType === "removed") {
              let x = await this.api(`global/update_one`, {
                table: "RenewRemovePlans",
                where: {
                  RatebID: item.RatebID
                },
                update: {
                  isChecked: item.isChecked === "تم التأكيد في الهيئة" ? 0 : 1
                }
              });
              this.findRemovedItems();
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id", "params.type"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "RenewCandidates",
        include: [
          {
            model: "Rateb",
            include: [
              {
                model: "Unit"
              },
              {
                model: "RatebPunishments"
              }
            ]
          },
          { model: "RenewList" }
        ],
        where: this.cleanObject({
          RenewListID: this.$route.params.id,
          RenewType: this.$route.params.type
        })
      })
        .then(async x => {
          let data = Object.values(
            lodash.groupBy(x.data, cand => cand.Rateb.ID)
          ).map(ele => ({
            ...ele[0],
            RatebPunishments: ele
              .map(ele => ele.Rateb.RatebPunishments)
              .filter(ele => ele.ID)
              .map(ele => ({
                ...ele,
                orderDate: new Date(
                  `${ele.orderDate?.split("-")[1]}-${
                    ele.orderDate?.split("-")[0]
                  }-${ele.orderDate?.split("-")[2]}`
                )
              }))
          }));
          this.totals.Disagree = data.filter(ele => !ele.isAgree).length;
          this.totals.agree = data.filter(ele => ele.isAgree).length;
          this.totals.HaveNotLeaderRecommendation = data.filter(
            ele => !ele.isHasRecommendation
          ).length;
          this.totals.Inappropriate = data.filter(
            ele => !ele.MedicalSituation
          ).length;
          this.totals.appropriate = data.filter(
            ele => ele.MedicalSituation
          ).length;
          data = await this.mapRatebToCand(data);
          // console.log("data", data);
          // for (let i = 0; i < data.length; i++) {
          //   await this.api(`global/update_one`, {
          //     table: "RenewCandidates",
          //     where: { ID_KEY: data[i].ID_KEY }
          //   });
          // }
          data = data.map(ele => ({ ...ele, CandidateGrade: ele.totalGrade }));
          this.totals.Grade = data.filter(ele => ele.totalGrade > 60).length;
          this.totals.TotalSuccess = data.filter(ele => {
            let x =
              ele.totalGrade > 60 &&
              ele.isAgree == "أرغب" &&
              ele.isHasRecommendation == "أوافق" &&
              ele.Requirements &&
              ele.MedicalSituation == "لائق";
            if (x) {
              console.log(ele);
            }
            return x;
          }).length;
          this.finalResult = data.filter(
            ele =>
              ele.totalGrade > 60 &&
              ele.isAgree == "أرغب" &&
              ele.Requirements &&
              ele.isHasRecommendation == "أوافق" &&
              ele.MedicalSituation == "لائق"
          );
          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            data: this.mainTable.items,
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable),
            hasParent: true
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    findAddedItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "added");

      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id", "params.type"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "RenewAddPlans",
        include: [
          {
            model: "Rateb",
            where: this.cleanObject({
              RatebLevel: where.RatebLevel,
              Name: where.Name,
              UnitID: where.UnitID
            }),
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ],
        where: this.cleanObject({
          RenewListID: this.$route.params.id,
          RenewType: this.$route.params.type
        })
      })
        .then(async x => {
          let data = await this.mapRatebToCand(x.data);
          data = data.map(ele => ({
            ...ele,
            isChecked: ele.isChecked ? "تم التأكيد في الهيئة" : "لم يتم التأكيد"
          }));

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            data: this.mainTable.items,
            excelKey: "data",
            excelHeaders: this.mainTable.headersAddedAndRemoved.filter(
              f => f.inTable
            ),
            hasParent: true
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    mapRatebToCand(arr) {
      console.log(arr);
      let renewDate = arr[0]?.RenewList?.DateOfRenewList;
      return Promise.all(
        arr.map(async ele => {
          let grades = await this.api("global/get_all", {
            table: "Grade",
            where: { SoliderID: ele.RatebID }
          });
          let cirtcalDate = new Date(renewDate).setFullYear(
            new Date(renewDate).getFullYear() - 3
          );

          let filtered = grades.data
            .map(ele => ({
              ...ele,
              To_Date: new Date(ele.To_Date)
            }))
            .filter(ele => ele.To_Date >= cirtcalDate)
            .sort((a, b) => b.To_Date - a.To_Date)
            .slice(0, 3);
          let gradeTotal = 0;
          if (filtered.length == 3) {
            gradeTotal = Math.round(
              filtered.reduce(
                (prev, cur) => prev + parseInt(cur.Nesba_Number),
                0
              ) / 3
            );
          }
          return {
            ...ele,
            isAgree: ele.isAgree ? "أرغب" : "لا أرغب",
            isHasRecommendation: ele.isHasRecommendation ? "أوافق" : "لا أوافق",
            MedicalSituation: ele.MedicalSituation ? "لائق" : "غير لائق",
            RequirementsText: ele.Requirements
              ? "تم الإستلام"
              : " لم يتم الإستلام",
            isGradesComspleted: filtered.length === 3,
            SatrtingSarefRateb: new Date(ele.SatrtingSarefRateb),
            SatrtingSarefRatebYears: Math.round(
              (new Date() - new Date(ele.SatrtingSarefRateb)) / 31536000000
            ),
            type: ele.FirstRenew ? "التجديد الثاني" : "التجديد الاول",
            totalGrade:
              gradeTotal == 0 ? "هناك بعض التقارير غير متاحة" : gradeTotal
          };
        })
      );
    },
    findRemovedItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "removed");

      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id", "params.type"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "RenewRemovePlans",
        include: [
          {
            model: "Rateb",
            where: this.cleanObject({
              RatebLevel: where.RatebLevel,
              Name: where.Name,
              UnitID: where.UnitID
            }),
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ],
        where: this.cleanObject({
          RenewListID: this.$route.params.id,
          RenewType: this.$route.params.type
        })
      })
        .then(async x => {
          let data = await this.mapRatebToCand(x.data);
          data = data.map(ele => ({
            ...ele,
            isChecked: ele.isChecked ? "تم التأكيد في الهيئة" : "لم يتم التأكيد"
          }));

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            data: this.mainTable.items,
            excelKey: "data",
            excelHeaders: this.mainTable.headersAddedAndRemoved.filter(
              f => f.inTable
            ),
            hasParent: true
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    findOne(id) {
      this.api("global/get_one", {
        table: "Rateb",
        where: { id }
      })
        .then(x => {
          this.$set(this.addModel, "Name", x.data.Name);
          this.$set(this.addModel, "Status", x.data.Status);
        })
        .catch(error => {})
        .finally(() => {});
    },
    async addNewToAddPlan() {
      if (!this.addModel.Name || this.addModel.Status != "بالخدمة") {
        this.showError("هذا الفرد غير مسجل او منتهي خدمته");
      } else {
        if (
          this.mainTable.items.find(ele => ele.RatebID == this.addModel.RatebID)
        ) {
          this.showError("هذا الفرد بالفعل موجود في النشرة");
        } else {
          this.$set(this, "addLoading", true);
          let saveItem;
          let candidate = {
            RenewListID: this.$route.params.id,
            RatebID: this.addModel.RatebID,
            isChecked: this.addModel.isChecked,
            Notes: this.addModel.Notes,
            RenewType: this.addModel.RenewType
          };
          saveItem = await this.api("global/create_one", {
            table: "RenewCandidates",
            where: candidate
          });

          saveItem = await this.api("global/create_one", {
            table: "RenewAddPlans",
            where: candidate
          });
          if (saveItem) {
            this.$set(this, "addLoading", false);
            this.showSuccess("تم الاضافة بنجاح");
            this.$set(this, "addModel", {});
            this.$set(this, "showAddNewDialog", false);
            this.findItems({});
          } else {
            this.$set(this, "addLoading", false);
            this.showError("حدث خطا اقناء  اضافة البيانات");
            this.$set(this, "showAddNewDialog", false);
          }
        }
      }
    },
    async removeFromCandidates() {
      console.log(this.removedItem);

      let saveItem;
      if (!this.removedItem.RenewListID) {
        this.showError("هذا الفرد غير مسجل لدينا");
      } else {
        this.$confirm(`هل انت متاكد من انك تريد شطب هذا الفرد`, {
          title: ``
        }).then(async res => {
          if (res) {
            let candidate = {
              RenewListID: this.$route.params.id,
              RatebID: this.removedItem.RatebID,
              isChecked: this.removedItem.isChecked,
              Notes: this.removedItem.Notes,
              RenewType: this.removedItem.RenewType
            };

            saveItem = await this.api("global/create_one", {
              table: "RenewRemovePlans",
              where: candidate
            });

            saveItem = await this.api("global/delete_all", {
              table: "RenewCandidates",
              where: {
                ID_KEY: this.removedItem.ID_KEY
              }
            });

            if (saveItem) {
              this.$set(this, "loading", false);
              this.showSuccess("تم الشطب بنجاح");
              this.$set(this, "showRemoveDialog", false);
              this.findItems({});
            } else {
              this.$set(this, "loading", false);
              this.showError("حدث خطا اثناء  اضافة البيانات");
              this.$set(this, "showRemoveDialog", false);
            }
          }
        });
      }
    },

    actionAdd() {
      this.$set(this, "showAddNewDialog", true);
    },
    async saveItem() {
      this.$set(this, "loading", true);
      this.$set(
        this.addModel,
        "isAgree",
        this.addModel.isAgree === "أرغب" ? 1 : 0
      );
      this.$set(
        this.addModel,
        "isHasRecommendation",
        this.addModel.isHasRecommendation === "أوافق" ? 1 : 0
      );
      this.$set(
        this.addModel,
        "MedicalSituation",
        this.addModel.MedicalSituation === "لائق" ? 1 : 0
      );

      let saveItem;
      try {
        saveItem = await this.api(
          !this.addModel.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "RenewCandidates",
            where: this.addModel.ID_KEY
              ? {
                  ID_KEY: this.addModel.ID_KEY
                }
              : {
                  ...this.addModel
                },
            update: {
              ...this.addModel
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});

          this.addModel = {};
          this.showAddDialog = false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "showAddDialog", false);
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this, "loading", false);
      }
    }
  }
};
</script>
