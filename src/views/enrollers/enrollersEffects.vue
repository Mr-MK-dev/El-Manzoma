<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="searchFollowers"
      @on-add="actionAdd"
      :clearOption="true"
      title="بحث متقدم في مؤثرات الملحقين"
      :addButton="false"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :isExcel="true"
      :title="'مؤثرات الملحقين'"
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
      <template v-slot:item.isRecommended="{ item }">
        <v-chip :color="item.isRecommended == 1 ? 'success' : 'error'">
          {{ item.isRecommended ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.isSelected="{ item }">
        <v-chip :color="item.isSelected == 1 ? 'success' : 'error'">
          {{ item.isSelected ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-if="hasEditAccess()" v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
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
      :data="effect"
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
  name: "enrollersSoldiersEffects",
  mounted() {
    this.init();
    this.getRecuEndDateOptions();
  },
  data: () => ({
    effect: {},
    search: {},
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
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inTable: true,
          multiple: true,
          notMultipleInModel: true,
          inSearch: true,
          inModel: false,
          readOnly: false,
          sort: 1
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
          readOnly: true,
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
          readOnly: true,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Category",
          searchValue: "Category",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الديانة",
          value: "Religion",
          searchValue: "Religion",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit",
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
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          multiple: true,
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Status",
          searchValue: "Status",
          type: "select",
          multiple: true,
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "تاريخ التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          multiple: true,
          sort: 3
        },
        {
          text: "مكان العمل",
          value: "followerwork.workplace",
          searchValue: "workplace",
          sortable: true,
          type: "select",
          multiple: true,
          notMultipleInModel: true,
          inSearch: true,
          inTable: true,
          inModel: false
        },
        {
          text: "الامر بالإلحاق",
          value: "Orderoffolwer",
          searchValue: "Orderoffolwer",
          type: "select",
          multiple: true,
          notMultipleInModel: true,
          sortable: true,
          inSearch: true,
          inTable: true,
          inModel: false
        },
        {
          text: "المؤيد",
          value: "Suputer",
          searchValue: "Suputer",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: false
        },
        {
          text: "الموصي",
          value: "Recommender",
          searchValue: "Recommender",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "العمل القائم به في مكان الإلحاق",
          value: "FollowerDuty",
          searchValue: "FollowerDuty",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: false
        },
        {
          text: "توصية",
          value: "isRecommended",
          searchValue: "isRecommended",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          readonly: false,
          sort: 1
        },
        {
          text: "إنتقاء",
          value: "isSelected",
          searchValue: "isSelected",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          readonly: false,
          sort: 1
        },
        {
          text: "تاريخ الإلحاق",
          value: "TarekhElhak",
          searchValue: "TarekhElhak",
          type: "date",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "سبب الإنهاء",
          value: "FollowerEndCause",
          searchValue: "FollowerEndCause",
          sortable: true,
          type: "textarea",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "الامر بإنهاء الإلحاق",
          value: "OrderOfEndFollower",
          searchValue: "OrderOfEndFollower",
          sortable: true,
          type: "select",
          multiple: true,
          notMultipleInModel: true,
          inTable: true,
          inSearch: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المستلم للجندي",
          value: "RecieverName",
          searchValue: "RecieverName",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ إنهاء الإلحاق",
          value: "FollowerEndDate",
          searchValue: "FollowerEndDate",
          type: "date",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: true,
          sort: 1
        }
      ],
      items: []
    },

    selects: {
      Type: {
        text: "text",
        value: "text",
        data: [{ text: "راتب عالى" }, { text: "مجند" }]
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      OrderOfEndFollower: {
        table: "EnrollersCertificators",
        text: "Name",
        value: "Name"
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      Category: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      Recommender: {
        text: "text",
        value: "text",
        data: constants.FollowingRecommender.data
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
      followplace: {
        table: "FollowingRigion",
        value: "FollowRigionID",
        text: "FollowRigionName"
      },
      workplace: {
        table: "followerwork",
        value: "idwork",
        text: "workplace"
      },
      Orderoffolwer: {
        table: "Certificators",
        text: "Name",
        value: "Name"
      }
    }
  }),
  methods: {
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.effect.isEdit ? "update_one" : "create_one"}`,
          {
            table: "followersolider",
            where: !this.effect.isEdit
              ? this.effect
              : {
                  ID_KEY: this.effect.ID_KEY
                },
            update: this.effect
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.searchFollowers(this.search);
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

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "effect", {
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
    searchFollowers(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      if (!filters?.Type?.length) {
        this.showError("برجاء اختيار نوع الفرد الملحق");
        return;
      }
      this.$set(this, "search", { ...filters });
      this.api("sections/tasgeel/search/enrollers", {
        search: this.cleanObject({
          ...filters,
          isEnrolled: false,
          // $ne: { isTrainingOrder: true },
          RatebCategory: filters.Category,
          RatebLevel: filters.Level,
          SoldierCategory: filters.Category,
          SoldierLevel: filters.Level
        })
      })
        .then(x => {
          console.log("data", x.data);
          let fixedData = x.data.map(ele => ({
              ...ele,
              Type: "Soldier" in ele ? "مجند" : "راتب عالي",
              Name: ele?.Soldier?.Name || ele?.Rateb?.Name,
              Status: ele?.Soldier?.Status || ele?.Rateb?.Status,
              Category:
                ele?.Soldier?.SoldierCategory || ele?.Rateb?.RatebCategory,
              Level: ele?.Soldier?.SoldierLevel || ele?.Rateb?.RatebLevel,
              RecuEndDate: ele?.Soldier?.RecuEndDate || "",
              KnowledgeLevel:
                ele?.Soldier?.KnowledgeLevel || ele?.Rateb?.KnowledgeLevel,
              Religion: ele?.Soldier?.Religion || ele?.Rateb?.Religion,
              RecuStage: ele?.Soldier?.RecuStage || "",
              Unit: ele?.Soldier?.Unit?.Unit || ele?.Rateb?.Unit?.Unit,
              Weapon: ele?.Soldier?.Weapon?.Weapon || ele?.Rateb?.Weapon?.Weapon
            })),
            printer = {
              cons: [...fixedData],
              excelKey: "cons",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };
          this.$set(this.mainTable, "items", fixedData);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          console.log("error", error);
          this.showError(
            "تعذر البحث عن الافراد الرجاء اعادة البحث بسبب مشاكل في الشبكة"
          );
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
