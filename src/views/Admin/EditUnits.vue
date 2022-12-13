<template>
  <div>
    <v-dialog
      persistent
      v-model="Internals.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="Internals.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <unitInternals ref="internals" :parentFilters="true"></unitInternals>
        </v-card-text>
      </v-card>
    </v-dialog>

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template
        v-if="isAdmin() || hasEditAccess()"
        v-slot:item.UnitInternals="{ item }"
      >
        <v-chip class="transparent">
          <v-btn
            icon
            @click="
              Internals.model = true;
              getInternals(item);
            "
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="isAdmin()">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
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
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "SMUnits",

  components: {
    unitInternals: () => import("@/views/Admin/PointsHubs.vue")
  },

  async mounted() {
    this.init();
    await this.handleSearch();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Unit: {
      isConfirmed: false
    },
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    items: [],
    headers: [
      {
        text: "السرايا",
        value: "UnitInternals",
        searchValue: "UnitInternals",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "البيانات الأساسية",
        value: "editor",
        searchValue: "editor",
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
        text: "اسم الوحدة المختصر",
        value: "ShortenName",
        searchValue: "ShortenName",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "اتجاه الوحدة",
        value: "Directionforunit",
        searchValue: "Directionforunit",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      // {
      //   text: "اتجاه العام",
      //   value: "GeneralDirection",
      //   searchValue: "GeneralDirection",
      //   sortable: true,
      //   type: "select",
      //   inSearch: false,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // },
      {
        text: "لشريحة",
        value: "SupplyLayer",
        searchValue: "SupplyLayer",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "داخل المراجعة الشهرية",
        value: "willReviewText",
        searchValue: "willReview",
        sortable: true,
        type: "checkbox",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    selects: {
      DirectionforFeaat: {
        text: "text",
        value: "text",
        data: constants.DirectionforFeaat.data
      },
      isSpecial: {
        text: "text",
        value: "value",
        data: [
          { text: "نعم", value: 1 },
          { text: "لا", value: 0 }
        ]
      },
      isHardWork: {
        text: "text",
        value: "value",
        data: [
          { text: "نعم", value: 1 },
          { text: "لا", value: 0 }
        ]
      },
      minimumDegree: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      extraProfitType: {
        text: "text",
        value: "value",
        data: [
          { text: "نعم", value: 1 },
          { text: "لا", value: 0 }
        ]
      },

      Directionforunit: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      GeneralDirection: {
        text: "text",
        value: "text",
        data: constants.GeneralDirection.data
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
    async handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = ["ID"],
        multi = [];
      where = this.mapToQuery(where, likes, multi);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Unit",
          where
        });

        let data = x.data.map(ele => ({
            ...ele,
            isSpecialText: ele.isSpecial ? "نعم" : "لا",
            willReviewText: ele.willReview ? "نعم" : "لا",
            isHardWorkText: ele.isHardWork ? "نعم" : "لا",
            extraProfitTypeText: ele.extraProfitType == 1 ? "نعم" : "لا"
          })),
          printer = {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.headers.filter(f => f.inSearch)
          };

        this.$set(this, "items", data);
        this.$set(this, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },

    async actionAdd() {
      this.$set(this, "item", {});
      this.$set(this, "showAddDialog", true);
    },
    async getInternals(item) {
      if (this.$refs.internals) {
        this.$refs.internals.mainTable.headers.forEach(function(obj) {
          if (obj.text == "الوحدة التابعة لها") {
            obj.readOnly = true;
          }
        });
        this.$refs.internals.pointHub.Unit_ID = item.UnitID;
        await this.$refs.internals.findItems({ Unit_ID: [item.UnitID] });
      } else {
        window.setTimeout(async () => {
          await this.getInternals(item);
        }, 4000);
      }
    },
    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Unit", { ...item, isEdit: true });
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            await this.api(`global/delete_all`, {
              table: "Unit",
              where: {
                UnitID: item.UnitID
              }
            });
            await this.handleSearch({});
          }
        })
        .catch(err => {
          this.handleError(err);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
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
                  UnitID: units.data.length + 3
                },
            update: {
              ...this.Unit
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.handleSearch(this.search);
          this, "showAddDialog", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "showAddDialog", false);
      } catch (error) {
        this.handleError(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this, "loading", false);
      }
    }
  }
};
</script>
