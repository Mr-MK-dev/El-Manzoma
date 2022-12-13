<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd"
      :clearOption="true"
      title="بحث فالجندي المثالي"
      addBtnTitle="إضافة جندي مثالي"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الجندي المثالي'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.Name}`"
          @click.right="copyText(item.Name)"
        >
          {{ item.Name }}
        </v-chip>
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="actionDelete(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="ideals"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "IdealSoldier",
  async mounted() {
    this.init();
    this.selects.RecuEndDate.data = this.fetchServiceEndDates();
    await this.fetchSoldierTypesWithRewards();
  },
  data: () => ({
    ideals: {},
    search: {},
    soldierTypeWithRewards: [],
    startAddProccess: false,
    searchLoading: false,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    mainTable: {
      printer: {},
      selected: [],
      search: "",
      headers: [
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          readOnly: false,
          required: true,

          sort: 1
        },
        {
          text: "الاسم",
          value: "Soldier.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },

        // {
        //   text: "تاريخ التكرييم",
        //   value: "DateOfHonor",
        //   searchValue: "DateOfHonor",
        //   sortable: true,
        //   type: "date",
        //   inSearch: true,
        //   inTable: true,
        //   inModel: true,
        //   readonly: true,
        //   sort: 1
        // },

        {
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Soldier.SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "العنوان",
          value: "Soldier.Address",
          searchValue: "Address",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "Soldier.RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          required: true,
          multiple: true,
          sort: 1
        },
        {
          text: "تاريخ التجنيد",
          value: "Soldier.RecuStartDate",
          searchValue: "RecuStartDate",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          required: true,
          sort: 1
        },
        {
          text: "الواجب المدرب عليه",
          value: "Soldier.Duty.Duty",
          searchValue: "DutyID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          required: true,
          sort: 1
        },
        {
          text: "العمل الفعلي القائم به",
          value: "Soldier.Duty.Duty",
          searchValue: "DutyID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          required: true,
          sort: 1
        },
        {
          text: "الرقم القومي",
          value: "Soldier.IdentityNo",
          searchValue: "IdentityNo",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "رقم الهاتف",
          value: "Soldier.SoldierTELE",
          searchValue: "SoldierTELE",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
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
          required: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "Soldier.KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Soldier.Status",
          searchValue: "Status",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "التكريم",
          value: "Honor",
          searchValue: "Honor",
          type: "text",
          sortable: false,
          inTable: true,
          inSearch: false,
          inModel: true
        }
      ],
      items: []
    },

    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },

      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      Type: {
        text: "text",
        value: "text",
        data: []
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },

      Status: {
        value: "text",
        text: "text",
        data: constants.SoldierStatus.data
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    }
  }),
  watch: {
    "ideals.ID"(newValue) {
      this.findOne(newValue);
    },
    "ideals.Type"(newValue) {
      this.ideals.Honor = this.soldierTypeWithRewards.find(
        ele => ele.Type === newValue
      ).Reward;
    }
  },
  methods: {
    async fetchSoldierTypesWithRewards() {
      let data = await this.api("global/get_all", {
        table: "SoliderTypesWithRewards"
      });

      this.$set(this, "soldierTypeWithRewards", data.data);

      this.selects.Type.data = data.data.map(ele => ele.Type);
    },
    fetchServiceEndDates() {
      let availableDates = [];
      let currentDate = new Date();
      console.log(currentDate);
      let previousYear = currentDate.getFullYear() - 10;
      console.log(previousYear);
      for (let i = 0; i < 30; i++) {
        availableDates.push(previousYear.toString() + "-02-01");
        availableDates.push(previousYear.toString() + "-03-01");
        availableDates.push(previousYear.toString() + "-05-01");
        availableDates.push(previousYear.toString() + "-06-01");
        availableDates.push(previousYear.toString() + "-08-01");
        availableDates.push(previousYear.toString() + "-09-01");
        availableDates.push(previousYear.toString() + "-11-01");
        availableDates.push(previousYear.toString() + "-12-01");
        previousYear++;
      }
      return availableDates;
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من حذف الجندي ؟`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "IdealSoldier",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({});
        }
      });
    },
    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Soldier",
          where: { id }
        })
          .then(x => {
            this.$set(this.ideals, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
      }
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", false);
      let saveItem;

      if (!this.ideals.isEdit && (await this.isDuplicate(this.ideals.ID))) {
        this.showError("هذا الرقم العسكري تم إلحاقه في قاعدة البيانات");
        return;
      }
      try {
        saveItem = await this.api(
          `global/${this.ideals.isEdit ? "update_one" : "create_one"}`,
          {
            table: "IdealSoldier",
            where: !this.ideals.isEdit
              ? this.ideals
              : {
                  ID_KEY: this.ideals.ID_KEY
                },
            update: this.ideals
          }
        );

        if (this.ideals.isEdit){
          console.log("Edited Soldier"   , this.ideals)
          await this.api(`global/update_one`, {
            table: "Soldier",
            where: {
              ID: this.ideals.ID
            },
            update: {
              Address: this.ideals.Address,
              IdentityNo: this.ideals.IdentityNo,
              SoldierTELE: this.ideals.SoldierTELE
            }
          });
        }


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

        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    actionAddSoldier() {
      this.$set(this, "startAddProccess", true);
    },
    actionAdd() {
      this.$set(this.ideals, "isEdit", false);
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.findOne(item.ID);
      this.$set(this.createdObject, "model", true);
      this.$set(this, "ideals", {
        ...item,
        isEdit: true
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
    async isDuplicate(ID) {
      ID ? ID : "";
      let data;
      data = await this.api("global/get_one", {
        table: "IdealSoldier",
        where: { ID }
      });
      if (data && data.data && data.ok) {
        console.log("data", data);
        return true;
      } else {
        return false;
      }
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID", "Name"],
        multi = ["RecuEndDate"],
        date = ["DateOfHonor"];

      where = this.mapToQuery(where, likes, multi, date);
      console.log("where condition", where);
      this.api("global/get_all", {
        table: "IdealSoldier",
        where: this.cleanObject({
          ID: where.ID
        }),
        include: [
          {
            model: "Soldier",
            where: this.cleanObject({
              Name: where.Name,
              RecuStage: where.RecuStage,
              KnowledgeLevel: where.KnowledgeLevel,
              Status: where.Status,
              SoldierCategory: where.SoldierCategory,
              UnitID: where.UnitID,
              RecuEndDate: where.RecuEndDate
            }),
            include: [
              {
                model: "Unit"
              },
              {
                model: "Duty"
              }
            ]
          }
        ]
        // where
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [
                ...data.map(ele => ({
                  ...ele
                }))
              ],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
              )
            };
          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
