<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'مؤثرات الراتب العالي الملحقين'"
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
  name: "enrollersRatebsEffects",
  mounted() {
    this.init();
    this.searchEnrollers({});
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
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: false,
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
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Rateb.RatebLevel",
          searchValue: "RatebLevel",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Rateb.RatebCategory",
          searchValue: "RatebCategory",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الديانة",
          value: "Rateb.Religion",
          searchValue: "Religion",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
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
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Rateb.RatebState",
          searchValue: "RatebState",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "مكان الإلحاق",
          value: "FollowingRigion.FollowRigionName",
          searchValue: "followplace",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 2
        },
        {
          text: "مكان العمل",
          value: "followerwork.workplace",
          searchValue: "workplace",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false
        },
        {
          text: "الامر بالإلحاق",
          value: "Orderoffolwer",
          searchValue: "Orderoffolwer",
          type: "select",
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
          inSearch: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الامر بإنهاء الإلحاق",
          value: "OrderOfEndFollower",
          searchValue: "OrderOfEndFollower",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
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
        },
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        }
      ],
      items: [],
      printer: {}
    },

    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      OrderOfEndFollower: {
        text: "text",
        value: "text",
        data: constants.Certificator.data
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
        table: "followersolider",
        value: "Orderoffolwer",
        text: "Orderoffolwer"
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
            table: "Followerrateb",
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
          this.searchEnrollers({});

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

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "effect", {
        ...item,
        isEdit: true
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

    searchEnrollers(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      this.api("global/get_all", {
        table: "Followerrateb",
        where: this.cleanObject({
          isEnrolled: false
        }),
        include: [
          {
            model: "FollowingRigion"
          },
          {
            model: "followerwork"
          },
          {
            model: "Rateb",
            include: [
              {
                model: "Unit"
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
                  ...ele,
                  isEnrolled: ele.isEnrolled ? "نعم" : "لا"
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
