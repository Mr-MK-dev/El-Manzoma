<template>
  <div>
    <search-bulider
      :fields="followingSuggestTabel.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="مقترح ملاحق المرحلة"
      addBtnTitle="إضافة التحاق"
    />
    <v-btn
      class="px-6"
      @click="calculateStatsWithFollowRigion()"
      v-if="followingSuggestTabel.items.length > 0"
      large
      color="primary"
      v-text="'عرض اليومية بالملاحق'"
    ></v-btn>

    <v-btn
      class="px-6"
      @click="calculateStatsWithUnit()"
      v-if="followingSuggestTabel.items.length > 0"
      large
      color="primary"
      v-text="'يومية بالأعداد الملحقة من كل وحدة'"
    ></v-btn>

    <table-bulider
      :headers="followingSuggestTabel.headers"
      :printer="followingSuggestTabel.printer"
      :items="followingSuggestTabel.items"
      :title="'الملاحق'"
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

      <template v-slot:item.Acceptance="{ item }">
        <v-chip
          @click="changeStatus(item)"
          :color="item.Acceptance == true ? 'success' : 'gray'"
        >
          {{ item.Acceptance == true ? "تمت الموافقة" : "في انتظار الموافقة" }}
        </v-chip>
      </template>
    </table-bulider>

    <v-dialog
      persistent
      v-model="followingSuggestStatsTabel.isDisplayed"
      scrollable
      max-width="750"
    >
      <v-card>
        <v-btn @click="followingSuggestStatsTabel.isDisplayed = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <table-bulider
          :headers="followingSuggestStatsTabel.headers"
          :printer="followingSuggestStatsTabel.printer"
          :items="followingSuggestStatsTabel.items"
          :title="'يومية عددية بالملاحق'"
        >
        </table-bulider>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      v-model="unitFollowingSuggestStatsTabel.isDisplayed"
      scrollable
      max-width="750"
    >
      <v-card>
        <v-btn @click="unitFollowingSuggestStatsTabel.isDisplayed = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <table-bulider
          :headers="unitFollowingSuggestStatsTabel.headers"
          :printer="unitFollowingSuggestStatsTabel.printer"
          :items="unitFollowingSuggestStatsTabel.items"
          :title="'يومية عددية بالملاحق من كل وحدة'"
        >
        </table-bulider>
      </v-card>
    </v-dialog>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="followingSuggestTabel.headers"
      :selects="selects"
      :data="followingSuggest"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "followingSuggest",
  props: {
    parentFilters: {
      type: Boolean,
      default: () => {}
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    followingSuggest: {},
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
    search: {
      WeaponID: types.harsHododId
    },
    searchLoading: false,
    followingSuggestTabel: {
      headers: [
        {
          text: "",
          value: "actions",
          searchValue: "actions",
          sortable: false,
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 0
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
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
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: false,
          sort: 1
        },
        {
          text: "الرقم الثلاثي",
          value: "tripleNo",
          searchValue: "tripleNo",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: false,
          sort: 1
        },
        {
          text: "المستوى الثقافي",
          value: "Soldier.KnowledgeLevel",
          searchValue: "Soldier.KnowledgeLevel",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 2
        },
        {
          text: "الوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 2
        },
        {
          text: "الإتجاه",
          value: "Soldier.Unit.Directionforunit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 2
        },
        {
          text: "الجهة لملحق ليها",
          value: "FollowingRigion.FollowRigionName",
          searchValue: "FollowRigionID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 2
        },
        {
          text: "الموصي",
          value: "FollowingRecommender",
          searchValue: "FollowingRecommender",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 4
        },
        {
          text: "الأمر بالإلحاق",
          value: "FollowingOrder",
          searchValue: "FollowingOrder",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
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
          sort: 5
        },
        {
          text: "تمت الموافقة",
          value: "Acceptance",
          searchValue: "Acceptance",
          sortable: true,
          type: "checkbox",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 5
        }
      ],
      items: [],
      printer: {}
    },

    followingSuggestStatsTabel: {
      isDisplayed: false,
      headers: [
        {
          text: "جهة الالتحاق",
          value: "FollowRigionName",
          sortable: true,
          inTable: true,
          sort: 2
        },
        {
          text: "المصدق عليه",
          value: "totalAccpted",
          sortable: true,
          inTable: true,
          sort: 1
        },
        {
          text: "المصدق عليه",
          value: "totalPending",
          sortable: true,
          inTable: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },

    unitFollowingSuggestStatsTabel: {
      isDisplayed: false,
      headers: [
        {
          text: "الوحدة",
          value: "Unit",
          sortable: true,
          inTable: true,
          sort: 2
        },
        {
          text: "جهة الالتحاق",
          value: "FollowRigion",
          sortable: true,
          inTable: true,
          sort: 2
        },
        {
          text: "العدد الملحق",
          value: "TotalFollowers",
          sortable: true,
          inTable: true,
          sort: 2
        }
      ],
      items: [],
      printer: {}
    },

    componentName: "createdObject",
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      FollowRigionID: {
        table: "FollowingRigion",
        value: "FollowRigionID",
        text: "FollowRigionName"
      },
      FollowingRecommender: {
        text: "text",
        value: "text",
        data: constants.FollowingRecommender.data
      },
      FollowingOrder: {
        text: "text",
        value: "text",
        data: constants.FollowingOrder.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      }
    },
    printer: {}
  }),
  watch: {},
  methods: {
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      try {
        let saveItem = await this.api(`global/create_one`, {
          table: "Followers",
          where: this.followingSuggest
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters,
          RecuStage: null,
          UnitID: null,
          WeaponID: null
        },
        likes = ["ID", "Name"],
        multi = [];
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Followers",
          where: this.mapToQuery(where, likes, multi),
          include: [
            {
              model: "FollowingRigion"
            },
            {
              model: "Soldier",
              where: this.cleanObject({
                UnitID: filters.UnitID,
                RecuStage: filters.RecuStage,
                WeaponID: filters.WeaponID
              }),
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ]
        });
        let data = x.data.map(ele => ({
            ...ele,
            Name: ele.Name || ele.Soldier?.Name,
            tripleNo: ele.tripleNo || ele.Soldier?.tripleNo
          })),
          printer = {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.followingSuggestTabel.headers.filter(
              f => f.inSearch
            )
          };
        this.$set(this.followingSuggestTabel, "items", data);
        this.$set(this.followingSuggestTabel, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    calculateStatsWithFollowRigion() {
      this.$set(this.followingSuggestStatsTabel, "isDisplayed", true);
      const groupdWithFollowRigionName = _.groupBy(
        this.followingSuggestTabel.items,
        "FollowingRigion.FollowRigionName"
      );

      this.$set(
        this.followingSuggestStatsTabel,
        "items",
        Object.keys(groupdWithFollowRigionName).map(key => ({
          FollowRigionName: key,
          totalAccpted: groupdWithFollowRigionName[key].filter(
            ele => ele.Acceptance
          ).length,
          totalPending: groupdWithFollowRigionName[key].filter(
            ele => !ele.Acceptance
          ).length
        }))
      );
      this.$set(this.followingSuggestStatsTabel, "printer", {
        data: this.followingSuggestStatsTabel.items,
        excelKey: "data",
        excelHeaders: this.followingSuggestStatsTabel.headers.filter(
          f => f.inTable
        )
      });
    },
    calculateStatsWithUnit() {
      this.$set(this.unitFollowingSuggestStatsTabel, "isDisplayed", true);
      const groupdWithUnit = _.groupBy(
        this.followingSuggestTabel.items,
        "Soldier.Unit.Unit"
      );
      this.$set(
        this.unitFollowingSuggestStatsTabel,
        "items",
        _.flatten(
          Object.keys(groupdWithUnit).map(key => {
            const groupdWithFollowRigion = _.groupBy(
              groupdWithUnit[key],
              "FollowingRigion.FollowRigionName"
            );

            return Object.keys(groupdWithFollowRigion).map(FollowRigion => ({
              Unit: key,
              FollowRigion,
              TotalFollowers: groupdWithFollowRigion[FollowRigion].length
            }));
          })
        )
      );
      this.$set(this.unitFollowingSuggestStatsTabel, "printer", {
        data: this.unitFollowingSuggestStatsTabel.items,
        excelKey: "data",
        excelHeaders: this.unitFollowingSuggestStatsTabel.headers.filter(
          f => f.inTable
        )
      });
    },
    async findSolider() {
      let search = this.search;
      let x;
      try {
        x = await this.api("global/get_one", {
          table: "Soldier",
          search: {
            ID: this.search.ID
          }
        });
        this.$set(this.followingSuggest, "Name", x.data.Name);
      } catch (e) {
        this.handleError(e);
      }
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    changeStatus(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (!item.Acceptance) {
              await this.api(`global/update_one`, {
                table: "Followers",

                where: {
                  ID: item.ID
                },
                update: {
                  Acceptance: false
                }
              });
              await this.api(`global/update_one`, {
                table: "Followers",
                where: {
                  ID: item.ID,
                  FollowRigionID: item.FollowRigionID
                },
                update: {
                  Acceptance: !item.Acceptance
                }
              });
            }
            await this.findItems({});
          }
        })
        .catch(err => {
          this.handleError(err);
        });
    }
  }
};
</script>
