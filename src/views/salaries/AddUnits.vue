<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      :clearOption="true"
      @on-search="data => handleSearch(data)"
      @on-add="actionAdd()"
      :loading="searchLoading"
      title="بحث متقدم في الوحدات "
      addBtnTitle="إضافة وحدة"
    />
    <v-dialog
      persistent
      v-model="Moratab.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="Moratab.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <jobsMoratab ref="jobs" :parentFilters="true"></jobsMoratab>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      v-model="OfficerMoratab.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="OfficerMoratab.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <officermortabat-duties
            ref="officerJobs"
            :parentFilters="true"
          ></officermortabat-duties>
        </v-card-text>
      </v-card>
    </v-dialog>

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template v-slot:item.Maininfo="{ item }">
        <v-chip class="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            @click="deleteItem(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-if="isAdmin()" v-slot:item.Subinfo="{ item }">
        <v-chip class="transparent">
          <v-btn
            icon
            @click="
              Moratab.model = true;
              getUnit(item);
            "
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-if="isAdmin()" v-slot:item.SubinfoOfficer="{ item }">
        <v-chip class="transparent">
          <v-btn
            icon
            @click="
              OfficerMoratab.model = true;
              getOfficerUnit(item);
            "
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-slot:item.isHardWork="{ item }">
        <v-chip :color="item.isHardWork == 1 ? 'success' : 'error'">
          {{ item.isHardWork ? "نعم" : "لا" }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="بيانات الوحدة"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="Unit"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
import OfficermortabatDuties from "@/views/salaries/officer_mortabat_duties";
const lodash = require("lodash");
const constants = require("../../Constant").default;
const jobsMoratab = require("./mortabat_duties");

export default {
  components: {
    OfficermortabatDuties,
    jobsMoratab: () => import("@/views/salaries/mortabat_duties.vue")
  },
  name: "UnitMangement",

  mounted() {
    this.init();
  },

  data: () => ({
    Moratab: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    OfficerMoratab: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Unit: {
      isConfirmed: false
    },
    items: [],
    headers: [
      {
        text: "البيانات الأساسية",
        value: "Maininfo",
        searchValue: "Maininfo",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "الوظائف",
        value: "Subinfo",
        searchValue: "Subinfo",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "وظائف الضباط",
        value: "SubinfoOfficer",
        searchValue: "SubinfoOfficer",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "اسم الوحدة",
        value: "Unit",
        searchValue: "Unit",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "كود التعبئة",
        value: "PackagingCode",
        searchValue: "PackagingCode",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "كود الإحصاء",
        value: "StatisticsCode",
        searchValue: "StatisticsCode",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "التشكيل",
        value: "Directionforunit",
        searchValue: "Directionforunit",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "القطاع",
        value: "Sector.Name",
        searchValue: "SectorID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "لشريحة",
        value: "SupplyLayer",
        searchValue: "SupplyLayer",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "السلاح التابع له",
        value: "Weapon.Weapon",
        searchValue: "FollowedWeaponID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "المستوى الأعلى",
        value: "CommandRegion.Name",
        searchValue: "CommandAreasID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "جهة التابعيه",
        value: "FollowingArea.Name",
        searchValue: "FollowingAreasID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "النمط",
        value: "Pattern.Name",
        searchValue: "PatternID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "حالة الوحدة",
        value: "statue",
        searchValue: "statue",
        sortable: true,
        type: "select",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      // {
      //   text: "فعالية الوحده",
      //   value: "isActivated",
      //   searchValue: "isActivated",
      //   sortable: true,
      //   type: "select",
      //   inSearch: true,
      //   multiple: false,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // },
      {
        text: "بيان الشكل",
        value: "ShapeType",
        searchValue: "ShapeType",
        sortable: true,
        type: "select",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "المرتب",
        value: "Moratab",
        searchValue: "Moratab",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        required: true,
        inModel: false
      },

      {
        text: "السياسة",
        value: "Siasa",
        searchValue: "Siasa",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        required: true,
        inModel: false
      },
      {
        text: "نسبة إستكمال مجند",
        value: "SoldiersCompletenessPercentage",
        searchValue: "SoldiersCompletenessPercentage",
        type: "text",
        sortable: true,
        inTable: true,
        inSearch: false,
        inModel: true
      },
      {
        text: "نسبة إستكمال رع",
        value: "RatebsCompletenessPercentage",
        searchValue: "RatebsCompletenessPercentage",
        type: "text",
        sortable: true,
        inTable: true,
        inSearch: false,
        inModel: true
      },
      {
        text: "رقم تعليمات تنظيم",
        value: "OrderNo",
        searchValue: "OrderNo",
        type: "text",
        sortable: true,
        inTable: true,
        inSearch: true,
        inModel: true
      },
      {
        text: "تاريخ تعليمات تنظيم",
        value: "OrderDate",
        searchValue: "OrderDate",
        type: "date",
        sortable: true,
        inTable: true,
        inSearch: true,
        inModel: true
      },
      {
        text: "بشأن",
        value: "forCause",
        searchValue: "forCause",
        type: "textarea",
        sortable: true,
        inTable: true,
        inSearch: true,
        inModel: true
      }
      // {
      //   text: "مميزة",
      //   value: "isSpecial",
      //   searchValue: "isSpecial",
      //   sortable: true,
      //   type: "checkbox",
      //   inSearch: false,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // },{
      //   text: "خدمة صعبة",
      //   value: "isHardWork",
      //   searchValue: "isHardWork",
      //   sortable: true,
      //   type: "checkbox",
      //   inSearch: false,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // },{
      //   text: "نوع المجهود المادي",
      //   value: "extraProfitType",
      //   searchValue: "extraProfitType",
      //   sortable: true,
      //   type: "select",
      //   inSearch: true,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // },
    ],
    selects: {
      DirectionforFeaat: {
        table: "Sectors",
        text: "Name",
        value: "Name"
      },

      Formation: {
        text: "text",
        value: "text",
        data: constants.Formation.data
      },

      ShapeType: {
        text: "text",
        value: "text",
        data: constants.ShapeTypes.data
      },
      Directionforunit: {
        table: "Unit",
        text: "Directionforunit",
        value: "Directionforunit"
      },
      GeneralDirection: {
        text: "text",
        value: "text",
        data: constants.GeneralDirection.data
      },
      FollowedWeaponID: {
        table: "Weapon",
        value: "WeaponID",
        text: "Weapon"
      },
      CommandAreasID: {
        table: "CommandRegions",
        value: "ID_KEY",
        text: "Name"
      },
      FollowingAreasID: {
        table: "FollowingAreas",
        value: "ID_KEY",
        text: "Name"
      },
      PatternID: {
        table: "Pattern",
        value: "ID_KEY",
        text: "Name"
      },
      SectorID: {
        table: "Sectors",
        value: "ID_KEY",
        text: "Name"
      },
      statue: {
        data: [
          {
            text: "بالخدمة",
            value: "بالخدمة"
          },
          {
            text: "ملغاه",
            value: "ملغاه"
          }
        ]
      },
      // isActivated: {
      //   data: [
      //     {
      //       text: "فعالة",
      //       value: "فعالة"
      //     },
      //     {
      //       text: "غير فعالة",
      //       value: "غير فعالة"
      //     }
      //   ]
      // },
      extraProfitType: constants.extraProfitType,
      SupplyLayer: {
        data: [
          {
            text: "الشريحة الاولي",
            value: "1"
          },
          {
            text: "الشريحة الثانية",
            value: "2"
          },
          {
            text: "الشريحتين",
            value: "1-2"
          }
        ]
      }
    }
  }),

  methods: {
    handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = ["ID"],
        multi = [],
        date = ["OrderDate"];
      where = this.mapToQuery(where, likes, multi, date);

      this.api("global/get_all", {
        table: "Unit",
        include: [
          {
            model: "Weapon"
          },
          {
            model: "CommandRegions"
          },
          {
            model: "FollowingAreas"
          },
          {
            model: "Pattern"
          },
          {
            model: "Sectors"
          }
        ],
        where
      })
        .then(async x => {
          const MortabatDuties = await this.api("global/get_all", {
            table: "MortabatDuties"
          });
          let data = x.data.map(ele => ({
              ...ele,
              Moratab: MortabatDuties.data
                .filter(m => m.UnitID == ele.UnitID)
                .reduce((prev, e) => prev + e.Moratab, 0),
              Siasa: MortabatDuties.data
                .filter(m => m.UnitID == ele.UnitID)
                .reduce((prev, e) => prev + e.Siasa, 0)
            })),
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inSearch)
            };

          this.$set(this, "items", data);
          this.$set(this, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async actionAdd() {
      this.$set(this, "item", {});
      this.$set(this, "showAddDialog", true);
    },
    async deleteItem(item) {
      try {
        await this.api(`global/delete_all`, {
          table: "Unit",
          where: {
            UnitID: item.UnitID
          }
        });
        this.showSuccess("تم الحذف بنجاح");
        this.handleSearch({});
      } catch (error) {
        this.showError("تلك الوحدة قد تكون متعلقة ب جنود او ظباط صف او مرتبات");
        console.log(error);
      }
    },
    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Unit", { ...item, isEdit: true });
    },
    async getUnit(item) {
      if (this.$refs.jobs) {
        this.$refs.jobs.mainTable.headers.forEach(function(obj) {
          if (obj.multiple == true) {
            obj.multiple = false;
          }
          if (obj.text == "الوحدة") {
            obj.readOnly = true;
          }
        });
        await this.$refs.jobs.findItems({ UnitID: [item.UnitID] });
      } else {
        window.setTimeout(async () => {
          await this.getUnit(item);
        }, 4000);
      }
    },
    async getOfficerUnit(item) {
      if (this.$refs.officerJobs) {
        this.$refs.officerJobs.mainTable.headers.forEach(function(obj) {
          if (obj.multiple == true) {
            obj.multiple = false;
          }
          if (obj.text == "الوحدة") {
            obj.readOnly = true;
          }
        });
        await this.$refs.officerJobs.findItems({ UnitID: [item.UnitID] });
      } else {
        window.setTimeout(async () => {
          await this.getUnit(item);
        }, 4000);
      }
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "Unit",
            where: {
              UnitID: item.UnitID
            }
          });
          this.handleSearch({});
        }
      });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      if (this.Unit.UnitID) {
        console.log("Shape Type", this.Unit.ShapeType);
      }
      try {
        let units = await this.api("global/get_all", {
          table: "Unit",
          where: {}
        });
        saveItem = await this.api(
          !this.Unit.UnitID ? `global/create_one` : `global/update_one`,
          {
            table: "Unit",
            where: this.Unit.UnitID
              ? {
                  UnitID: this.Unit.UnitID
                }
              : {
                  ...this.Unit,
                  UnitID: units.data.length * 2 + 3
                },
            update: {
              ...this.Unit
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.handleSearch(this.search);
          this, "showAddDialog", false;
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
