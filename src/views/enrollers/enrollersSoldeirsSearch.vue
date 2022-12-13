<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="searchEnrollers"
      @on-add="actionAdd"
      :clearOption="true"
      title="بحث متقدم فالملحقين"
      addBtnTitle="إضافة الحاق"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الملحقين'"
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
      <template v-slot:item.isEnrolled="{ item }">
        <v-chip
          @click="actionCertificatie(item)"
          :color="item.isEnrolled == 1 ? 'success' : 'error'"
        >
          {{ item.isEnrolled ? "نعم" : "لا" }}
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
      <template v-slot:item.isTrainingOrder="{ item }">
        <v-chip :color="item.isTrainingOrder == 1 ? 'success' : 'error'">
          {{ item.isTrainingOrder ? "نعم" : "لا" }}
        </v-chip>
      </template>

      <template v-slot:item.followerDuration="{ item }">
        <v-chip>
          {{ dateDiff(item) }}
        </v-chip>
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
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
            @click="actionDelete(item)"
            color="error"
          >
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
      :data="enrSold"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="effectDialog.model"
      :loading="effectDialog.loading"
      :fields="effectsTable.headers"
      :selects="selects"
      :data="effect"
      @on-submit="saveEffect()"
      @on-close="effectDialog.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "enrollersSoldiers",
  mounted() {
    this.init();
    this.getRecuEndDateOptions();
  },
  data: () => ({
    enrSold: {},
    effect: {},
    search: {},
    startAddProccess: false,
    effectDialog: {
      model: false,
      loading: false
    },
    searchLoading: false,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    effectsTable: {
      headers: [
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
          text: "المستلم للجندي",
          value: "RecieverName",
          searchValue: "RecieverName",
          sortable: true,
          type: "text",
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
        }
      ]
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
          text: "الديانة",
          value: "Soldier.Religion",
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
          text: "المرحلة",
          value: "Soldier.RecuStage",
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
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
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
          text: "تاريخ التسريح",
          value: "Soldier.RecuEndDate",
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
          text: "التصنيف",
          value: "followerwork.wokel7aq",
          searchValue: "wokel7aq",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
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
          required: true,
          inModel: true
        },
        {
          text: "الامر بالإلحاق",
          value: "Orderoffolwer",
          searchValue: "Orderoffolwer",
          type: "select",
          sortable: true,
          inSearch: true,
          inTable: true,
          inModel: true
        },
        {
          text: "المؤيد",
          value: "Suputer",
          searchValue: "Suputer",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "الملاحظات",
          value: "notes",
          searchValue: "notes",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "الموصي",
          value: "Recommender",
          searchValue: "Recommender",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "العمل القائم به في مكان الإلحاق",
          value: "FollowerDuty",
          searchValue: "FollowerDuty",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "مستمر إلحاقه",
          value: "isEnrolled",
          searchValue: "isEnrolled",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          readonly: false,
          sort: 1
        },
        {
          text: "توصية",
          value: "isRecommended",
          searchValue: "isRecommended",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inModel: true,
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
          inModel: true,
          inSearch: true,
          readonly: false,
          sort: 1
        },
        {
          text: "أمر مهمة تدريب",
          value: "isTrainingOrder",
          searchValue: "isTrainingOrder",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inModel: true,
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
          inModel: true,
          inSearch: true,
          sort: 1
        },
        {
          text: "مدة الإلحاق ",
          value: "followerDuration",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
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
      OrderOfEndFollower: {
        table: "Certificators",
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
      wokel7aq: {
        table: "followerwork",
        value: "wokel7aq",
        text: "wokel7aq"
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
        value: "text",
        text: "text",
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
      allWorkplace: {
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
  watch: {
    async "enrSold.wokel7aq"(newValue) {
      this.selects.workplace.data = this.selects.allWorkplace.data.filter(
        ele => ele.wokel7aq == newValue
      );
    },

    "enrSold.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  selectWorkPlace(workPlaceCategory) {
    this.$set(this.createdObject, "loading", true);

    this.api("global/get_one", {
      table: "followerwork",
      where: { wokel7aq: workPlaceCategory }
    })
      .then(x => {
        this.$set(this.situation, "Name", x.data.Name);
      })
      .catch(error => {
        this.$set(this.situation, "Name", "");
      })
      .finally(() => {
        this.$set(this.createdObject, "loading", false);
      });
  },
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "followersolider",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.searchEnrollers({});
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
            this.$set(this.enrSold, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
      }
    },
    dateDiff(item) {
      var startDate = new Date(
        new Date(item.TarekhElhak).toISOString().substr(0, 10)
      );

      var endDate = new Date();
      if (startDate > endDate) {
        var swap = startDate;
        startDate = endDate;
        endDate = swap;
      }
      var startYear = startDate.getFullYear();
      var february =
        (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
          ? 29
          : 28;
      var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      var yearDiff = endDate.getFullYear() - startYear;
      var monthDiff = endDate.getMonth() - startDate.getMonth();
      if (monthDiff < 0) {
        yearDiff--;
        monthDiff += 12;
      }
      var dayDiff = endDate.getDate() - startDate.getDate();
      if (dayDiff < 0) {
        if (monthDiff > 0) {
          monthDiff--;
        } else {
          yearDiff--;
          monthDiff = 11;
        }
        dayDiff += daysInMonth[startDate.getMonth()];
      }

      return yearDiff + " سنة " + monthDiff + " شهر " + dayDiff + " يوم ";
    },
    async saveEffect() {
      this.$set(this.effectDialog, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/update_one`, {
          table: "followersolider",
          where: { ID_KEY: this.effect.ID_KEY },
          update: this.effect
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.searchEnrollers({});
          this.effectDialog, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.effectDialog, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this, "effect", {});
        this.$set(this.effectDialog, "loading", false);
      }
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", false);
      let saveItem;

      if (!this.enrSold.isEdit && (await this.isDuplicate(this.enrSold.ID))) {
        this.showError("هذا الرقم العسكري تم إلحاقه في قاعدة البيانات");
        return;
      }
      try {
        saveItem = await this.api(
          `global/${this.enrSold.isEdit ? "update_one" : "create_one"}`,
          {
            table: "followersolider",
            where: !this.enrSold.isEdit
              ? this.enrSold
              : {
                  ID_KEY: this.enrSold.ID_KEY
                },
            update: this.enrSold
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
    actionAddSoldier() {
      this.$set(this, "startAddProccess", true);
    },
    actionAdd() {
      this.$set(this.enrSold, "isEdit", false);
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.findOne(item.ID);
      this.$set(this.createdObject, "model", true);
      this.$set(this, "enrSold", {
        ...item,
        isEdit: true,
        wokel7aq: item.followerwork.wokel7aq
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
    actionCertificatie(item) {
      if (!item.isEnrolled) {
        return;
      }
      if (this.hasEditAccess()) {
        this.$confirm(`هل انت متاكد من إنهاء الإلحاق `, {
          title: ``
        }).then(async res => {
          if (res) {
            this.$set(this, "effect", { ...item, isEnrolled: false });
            console.log(this.effect);
            this.$set(this.effectDialog, "model", true);
          }
        });
      } else {
        return;
      }
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
        table: "followersolider",
        where: { ID, isEnrolled: true }
      });
      if (data && data.data && data.ok) {
        console.log("data", data);
        return true;
      } else {
        return false;
      }
    },
    searchEnrollers(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID", "Name"],
        multi = [],
        date = ["TarekhElhak"];

      where = this.mapToQuery(where, likes, multi, date);
      console.log("where condition", where);
      this.api("global/get_all", {
        table: "followersolider",
        where: this.cleanObject({
          ID: where.ID,
          followplace: where.followplace,
          workplace: where.workplace,
          isEnrolled: where.isEnrolled,
          TarekhElhak: where.TarekhElhak,
          isRecommended: where.isRecommended,
          isSelected: where.isSelected,
          isTrainingOrder: where.isTrainingOrder,
          Recommender: where.Recommender
        }),
        include: [
          {
            model: "FollowingRigion"
          },
          {
            model: "followerwork"
          },
          {
            model: "Soldier",
            where: this.cleanObject({
              Name: where.Name,
              RecuStage: where.RecuStage,
              KnowledgeLevel: where.KnowledgeLevel,
              Status: where.Status,
              SoldierCategory: where.SoldierCategory,
              Religion: where.Religion,
              RecuEndDate: where.RecuEndDate,
              UnitID: where.UnitID
            }),
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
