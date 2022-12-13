<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :addButton="false"
      :clearOption="true"
    />
    <v-card class="mt-8">
      <v-card-title>
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="mainTable.selected.length == 0"
          :data="mainTable.printer"
          :wordFile="'/tasgeel/transportLicense'"
          :fab="false"
          @fileIsOpened="handelFileIsOpened()"
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        v-model="mainTable.selected"
        :height="600"
        :single-select="false"
        :headers="mainTable.headers.filter(h => h.inTable)"
        :items="mainTable.items"
        :items-per-page="15"
        show-select
        hide-default-header
        item-key="ID"
        multi-sort
        fixed-header
        ref="mainTable"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="mainTable.items"
            :table="table"
            :filters.sync="tableFilters"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters"
            :table="table"
          ></table-footer-filters>
        </template>

        <template
          v-for="slot in Object.keys($scopedSlots)"
          :slot="slot"
          slot-scope="scope"
        >
          <slot :name="slot" v-bind="scope"
        /></template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "transportLicenseSM",
  mounted() {
    this.init();
  },
  data: () => ({
    tableFilters: {},
    license: {},
    search: {},
    searchLoading: false,
    mainTable: {
      selected: [],
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: false,
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Status",
          searchValue: "Status",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: false
        },
        {
          text: "السلاح",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          multiple: true,
          sort: 1
        },
        {
          text: "الوظيفة",
          value: "Duty.Duty",
          searchValue: "DutyID",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          sort: 1
        },
        {
          text: "حالة الطباعة",
          value: "isPrinted",
          searchValue: "isPrinted",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          sort: 1
        },
        {
          text: "تاريخ التسجيل",
          value: "createdAt",
          searchValue: "createdAt",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      isPrinted: {
        text: "text",
        value: "value",
        data: [
          {
            value: false,
            text: "لا"
          },
          {
            value: true,
            text: "نعم"
          },
          {
            value: null,
            text: "الكل"
          }
        ]
      }
    },

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    }
  }),
  watch: {
    "mainTable.selected"(newValue) {
      console.log(newValue);
      this.$set(this.mainTable, "printer", []);

      let printer = {
        data: [
          ...newValue.map((ele, index) => ({
            ...ele,
            index: index + 1,
            unit: ele?.Unit?.Unit?.replace("(", "").replace(")", ""),
            duty: ele.Duty.Duty
          }))
        ],
        weapon: newValue[0]?.Weapon?.Weapon || "",
        RecuStage: newValue[0]?.RecuStage || "",
        StageNumber: constants.RecuStage.data.find(
          ele => ele.text == newValue[0]?.RecuStage.split("-")[0]
        )?.count,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      };
      this.$set(this.mainTable, "printer", printer);
    }
  },
  methods: {
    handelFileIsOpened() {
      this.$confirm(`هل تم الطباعة ؟ `, {
        title: ``
      })
        .then(async res => {
          if (res) {
            //
            await this.api(`global/queryRunners`, {
              query: `UPDATE [dbo].[Soldier] SET [isPrinted]=1 WHERE ID in (${this.mainTable.selected
                .map(ele => `N'${ele.ID}'`)
                .join(",")})`
            });
          }
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    initDates() {
      let dates = this.mainTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      console.log(filters);

      let where = {
          ...filters
        },
        likes = ["ID", "Name"],
        multi = ["WeaponID"],
        date = ["createdAt"];

      if (!where.RecuStage || !where.WeaponID) {
        this.showError("يجب التأكد من اختيار السلاح و المرحلة اولا");
        return;
      }

      where = this.mapToQuery(where, likes, multi, date);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Soldier",
          where: this.cleanObject({
            RecuStage: where.RecuStage,
            createdAt: where.createdAt,
            WeaponID: where.WeaponID,
            isPrinted: filters.isPrinted,
            UnitID: { $ne: 0 }
          }),
          include: [
            {
              model: "Unit"
            },
            {
              model: "Weapon"
            },
            {
              model: "Duty"
            }
          ]
        });

        let data = x.data,
          printer = {
            data: [
              ...data.map((ele, index) => ({
                ...ele,
                index: index + 1,
                unit: ele?.Unit?.Unit?.replace("(", "").replace(")", ""),
                duty: ele.Duty.Duty
              }))
            ],
            RecuStage: data[0]?.RecuStage || "",
            StageNumber: constants.RecuStage.data.find(
              ele => ele.text == data[0]?.RecuStage.split("-")[0]
            )?.count,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            RecuStage: filters?.RecuStage || ""
          };
        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "selected", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
