<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :loading="searchLoading"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم "
      :addButton="false"
    />

    <v-card>
      <v-card-title>
        <v-btn
          color="primary"
          outlined
          large
          class="px-6"
          v-if="mainTable.items.length > 0"
          @click="moveSolidersToServer()"
          v-text="'نقل للخدمة'"
        />
      </v-card-title>
    </v-card>

    <v-card class="mt-8">
      <v-card-title>
        <v-spacer></v-spacer>
        <printer-menu :data="mainTable.printer" :fab="false"></printer-menu>
      </v-card-title>
      <v-divider></v-divider>

      <!--    <table-bulider-->
      <!--      :headers="mainTable.headers"-->
      <!--      :printer="mainTable.printer"-->
      <!--      :items="mainTable.items"-->
      <!--    >-->
      <!--      <template v-slot:item.ID="{ item }">-->
      <!--        <v-chip-->
      <!--          color="transparent"-->
      <!--          :to="`/soldiers_plus/${item.ID}`"-->
      <!--          @click.right="copyText(item.ID)"-->
      <!--        >-->
      <!--          {{ item.ID }}-->
      <!--        </v-chip>-->
      <!--      </template>-->
      <!--    </table-bulider>-->

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
        <template v-slot:item.ID="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.ID}`"
            @click.right="copyText(item.ID)"
          >
            {{ item.ID }}
          </v-chip>
        </template>
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
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "SupportRecommandations",
  props: {
    parentFilters: {
      type: Boolean,
      default: () => {}
    }
  },
  mounted() {
    // this.initDates();
    this.init();

    this.getRecuEndDateOptions();
  },
  data: () => ({
    tableFilters: {},

    Effect: {},
    groupedValue: [],
    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
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
          inSearch: false,
          inTable: true,
          inModel: true,
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
          inModel: true,
          readonly: true,
          sort: 2
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 2
        },
        {
          text: "الحالة",
          value: "Status",
          searchValue: "Status",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 3
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
          sort: 3
        },
        {
          text: "الحالة",
          value: "Status",
          searchValue: "Status",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 3
        },
        {
          text: "السلاح",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 2
        },

        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          multiple: true,
          inModel: false,
          sort: 4
        },
        {
          text: "الوظيفة",
          value: "Duty.Duty",
          searchValue: "DutyID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 4
        },
        {
          text: "تاريخ التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: false,
          multiple: true,
          sort: 3
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "createdObject",
    selects: {
      SituationID: {
        table: "EffectSituationStates",
        value: "SituationID",
        text: "Situation"
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.newData
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      WeaponID: {
        text: "Weapon",
        value: "WeaponID",
        table: "Weapon"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      DutyID: {
        table: "Duty",
        value: "DutyID",
        text: "Duty"
      },
      Contnuity: {
        text: "text",
        value: "text",
        data: [
          {
            text: "متابع"
          },
          {
            text: "غير متابع"
          }
        ]
      }
    }
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      try {
        this.search = filters;
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);
        let where = {
            ...this.search,
            ...filters,
            Status: "مستجد بالمركز"
          },
          likes = ["ID"],
          multi = ["UnitID"];
        where = this.mapToQuery(where, likes, multi);
        const x = await this.api("global/get_all", {
          table: "Soldier",
          include: [
            {
              model: "Duty"
            },
            {
              model: "Unit"
            },
            {
              model: "Weapon"
            }
          ],
          where
        });

        let data = x.data,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
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
      //
      // await Promise.all(
      //     this.mainTable.items.map(ele => {
      //       return this.api("global/update_one", {
      //         table: "Soldier",
      //         where: {
      //           KnowledgeLevel : {
      //             $in :  ["اعداديه", "راسب اعداديه", "ابتدائيه" , "راسب ابتدائيه" , "امي"]
      //           }
      //         },
      //         update: {
      //           KnowledgeLevel: "عادة",
      //
      //         }
      //       });
      //     })
      // );
    },

    async moveSolidersToServer() {
      this.$confirm(`هل انت متاكد من نقل الى الخدمة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (
              this.mainTable.selected.filter(ele => ele.UnitID == 0).length ==
              this.mainTable.selected.length
            ) {
              this.showError("كل الاشخاص الموجودون بدون وحدات ولا يمكن نقلهم ");
            } else {
              for (const el of this.mainTable.selected.filter(
                ele => ele.UnitID != 0
              )) {
                await this.api("global/update_one", {
                  table: "Soldier",
                  where: {
                    ID: el.ID
                  },
                  update: {
                    Status: "بالخدمة",
                    SoldierStatus: ""
                  }
                });

                await this.api("global/create_one", {
                  table: "UnitEffecs",
                  where: {
                    UnitID: el.UnitID,
                    ID: el.ID,
                    increment: true,
                    date: new Date(),
                    type: "Soldier",
                    descrption:
                      "تمت اضافة الجندي الى الوحدة و نقل حالته من مستجد بالمركز الى بالخدمة "
                  }
                });
              }
              if (
                this.mainTable.selected.filter(ele => ele.UnitID == 0).length >
                0
              ) {
                this.showSuccess(
                  "تم نقل الافراد للخدمة ومتبقي " +
                    this.mainTable.selected.filter(ele => ele.UnitID == 0)
                      .length +
                    " اشخاص"
                );
              } else {
                this.showSuccess("تم تحديث الافراد بنجاح");
              }
              await this.findItems(this.search);
            }
          }
        })
        .catch(err => {
          this.handleError(err);
        });
    },
    async getRecuEndDateOptions() {
      const result = await this.api("global/queryRunners", {
        query: `   select count (ID) count ,  RecuEndDate  from Soldier GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
      this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);
      this.allUnites = [...this.selects.unitIds.data];
    },
    initDates() {
      let dates = this.mainTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "Effect", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
