<template>
  <div>
    <editor-dialog-bulider
      :title="'إضافة فرد لمجموعات إستعواض الخسائر'"
      :open="TypeObject.model"
      :fields="KindEditor.headers"
      :selects="selects"
      :loading="KindEditor.loading"
      :data="preEditor"
      @on-submit="CompleteEditorData()"
      @on-close="TypeObject.model = false"
    >
    </editor-dialog-bulider>

    <editor-dialog-bulider
      :title="'إضافة فرد للمنظومة'"
      :open="addSoldierEditor.model"
      :fields="addSoldierEditor.headers"
      :selects="selects"
      :data="addSoldierEditor.addedSoldier"
      @on-submit="createSoldier()"
      @on-close="addSoldierEditor.model = false"
    >
    </editor-dialog-bulider>
    <v-card-title>
      <v-btn @click="actionAdd()" large outlined color="primary">
        إضافة فرد إحتياط الى مجموعة إستعواض خسائر
      </v-btn>
    </v-card-title>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'تفاصيل مجموعات استعواض الخسائر'"
      :isExcel="true"
    >
      <template v-slot:item.SoldierID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoldierID}`"
          @click.right="copyText(item.SoldierID)"
        >
          {{ item.SoldierID }}
        </v-chip>
      </template>
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent">
          <!--          <v-btn icon @click="actionEdit(item)" color="primary">-->
          <!--            <v-icon>mdi-pencil</v-icon>-->
          <!--          </v-btn>-->
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "CompensationLossDetails",

  components: {},
  watch: {
    "preEditor.ID"(newValue) {
      this.findOne(newValue);
    }
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
    this.initWithoutChecking();
    this.findItems({});
  },

  data: () => ({
    selects: {
      UnitID: {
        ignoreStatus: true,
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      PackagedUnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit",
        ignoreStatus: true
      },
      LossGroupID: {
        table: "LossGroups",
        value: "ID_KEY",
        text: "Name"
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      CentreID: {
        table: "Centre",
        text: "Centre",
        value: "CentreID"
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      RecuRegionText: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      }
    },
    addSoldierEditor: {
      model: false,
      addedSoldier: {},
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الفئة",
          value: "SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ التجنيد",
          value: "RecuStartDate",
          searchValue: "RecuStartDate",
          sortable: true,
          type: "date",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: false,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "date",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "منطقة التجنيد",
          value: "RecuRegion",
          searchValue: "RecuRegionText",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المحافظة",
          value: "KnowledgeLevel",
          searchValue: "CityID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المركز",
          value: "KnowledgeLevel",
          searchValue: "CentreID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        }
      ]
    },
    KindEditor: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
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
          inTable: true,
          inSearch: true,
          inModel: true,
          readOnly: true,
          sort: 1
        }
      ]
    },
    preEditor: {},
    loading: false,
    TypeObject: {
      model: false,
      item: {}
    },
    CompensationPlanDetails: {},
    mainTable: {
      headers: [
        {
          text: "",
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
          text: "الرقم العسكري",
          value: "SoldierID",
          searchValue: "SoldierID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Soldier.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "المحافظة",
          value: "Soldier.City.City",
          searchValue: "CityID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "وحدة التعبئة",
          value: "LossGroup.Name",
          searchValue: "LossGroupID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Soldier.SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "Soldier.RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
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

  methods: {
    findOne(id) {
      if (id.length > 12) {
        this.api("global/get_one", {
          table: "Soldier",
          where: { id }
        })
          .then(x => {
            this.$set(this.preEditor, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
      }
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "CompensationLossCandidates",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({});
        }
      });
    },
    actionAdd() {
      this.$set(this, "preEditor", {});
      this.$set(this.TypeObject, "model", true);
    },
    CompleteEditorData() {
      this.$set(this.TypeObject, "model", false);
      this.findSoldier(this.preEditor.ID);
    },
    async createSoldier() {
      let createSoldier = await this.api("global/create_one", {
        table: "Soldier",
        where: {
          ID: this.addSoldierEditor.addedSoldier.ID,
          Name: this.addSoldierEditor.addedSoldier.Name,
          UnitID: this.addSoldierEditor.addedSoldier.UnitID,
          Status: "منتهى خدمته",
          SoldierStatus: "نقل على الإحتياط",
          WeaponID: 52,
          SoldierCategory: this.addSoldierEditor.addedSoldier.SoldierCategory,
          RecuEndDate: this.addSoldierEditor.addedSoldier.RecuEndDate,
          RecuStartDate: this.addSoldierEditor.addedSoldier.RecuStartDate,
          RecuRegion: this.addSoldierEditor.addedSoldier.RecuRegionText,
          CityID: this.addSoldierEditor.addedSoldier.CityID,
          CentreID: this.addSoldierEditor.addedSoldier.CentreID,
          KnowledgeLevel: this.addSoldierEditor.addedSoldier.KnowledgeLevel
        }
      });
      if (createSoldier.data) {
        this.$set(this.addSoldierEditor, "model", false);
        await this.addSoldierToPlan();
      }
    },
    async findSoldier(ID) {
      if (ID.length > 10) {
        this.$set(this.createdObject, "loading", true);

        let soldier = await this.api("global/get_one", {
          table: "Soldier",
          where: { ID }
        });
        if (soldier.data) {
          console.log("Existent Soldier");
          // to add direcct to the plan
          if (soldier.data.Status == "بالخدمة") {
            return this.showError(
              "هذا الفرد بالخدمة لا يمكن اضافته لخطة التعبئة"
            );
          }
          if (
            this.mainTable.items.find(ele => ele.SoldierID === soldier.data.ID)
          ) {
            return this.showError("هذا الفرد مضاف بالفعل  لخطة");
          }
          await this.addSoldierToPlan();
        } else {
          console.log("Not Existent Soldier");

          // to open add soldier dialog
          this.$confirm(`هذا الجندي غير مضاف للمنظومة هل ترغب باضافته ؟`, {
            title: ``
          }).then(async res => {
            if (res) {
              this.$set(this.addSoldierEditor, "addedSoldier", {
                ID: this.preEditor.ID
              });
              this.$set(this.addSoldierEditor, "model", true);
            }
          });
        }
      }
    },
    async addSoldierToPlan() {
      this.KindEditor.loading = true;
      let addToCandidates = await this.api("global/create_one", {
        table: "CompensationLossCandidates",
        where: {
          PackageID: this.$route.params.id,
          LossGroupID: this.$route.params.LossGroupID,
          SoldierID: this.preEditor.ID
        }
      });
      if (addToCandidates.data) {
        this.showSuccess("تم بنجاح");
        this.findItems({});
      }
      this.KindEditor.loading = false;
    },

    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "CompensationLossCandidates",
        include: [
          {
            model: "LossGroups"
          },
          {
            model: "Soldier",
            include: [
              {
                model: "Unit"
              },
              {
                model: "City"
              }
            ]
          }
        ],
        where:
          this.$route.params.PackagedUnitID != "0"
            ? this.cleanObject({
                PackageID: this.$route.params.id,
                LossGroupID: this.$route.params.LossGroupID
              })
            : this.cleanObject({
                PackageID: this.$route.params.id
              })
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
