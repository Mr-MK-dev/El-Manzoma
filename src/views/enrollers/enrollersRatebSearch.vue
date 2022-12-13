<template>
  <div>
    <!-- <v-dialog
      persistent
      v-model="startAddProccess"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-title>
          <v-btn @click="startAddProccess = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <rateb-search @on-select="actionAdd" :singleSelect="true" />
      </v-card>
    </v-dialog> -->
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="searchEnrollers"
      @on-add="actionAdd"
      :clearOption="true"
      title="بحث متقدم فالراتب العالي الملحقين "
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
      :data="rateb"
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
  name: "enrollersRateb",
  mounted() {
    this.init();
  },
  data: () => ({
    search: {},
    startAddProccess: false,
    rateb: {},
    effect: {},
    searchLoading: false,
    effectDialog: {
      model: false,
      loading: false
    },
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
          value: "Rateb.Name",
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
          text: "الفئة",
          value: "Rateb.RatebCategory",
          searchValue: "RatebCategory",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
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
          required: true,
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
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "الوحده",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
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
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Rateb.Status",
          searchValue: "Status",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
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
      items: [],
      printer: {}
    },

    selects: {
      Recommender: {
        text: "text",
        value: "text",
        data: constants.FollowingRecommender.data
      },
      OrderOfEndFollower: {
        text: "text",
        value: "text",
        data: constants.Certificator.data
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
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
      RatebState: {
        table: "Rateb",
        value: "RatebState",
        text: "RatebState"
      },
      RatebLevel: {
        table: "Rateb",
        value: "RatebLevel",
        text: "RatebLevel"
      },
      RatebCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      wokel7aq: {
        table: "followerwork",
        value: "wokel7aq",
        text: "wokel7aq"
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
        text: "text",
        value: "text",
        data: constants.Certificator.data
      },
      SupplyingRigion: {
        table: "Rateb",
        value: "SupplyingRigion",
        text: "SupplyingRigion"
      }
    }
  }),
  watch: {
    async "rateb.wokel7aq"(newValue) {
      console.log(newValue);
      this.selects.workplace.data = this.selects.allWorkplace.data.filter(
        ele => ele.wokel7aq == newValue
      );
    },
    "rateb.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    async saveEffect() {
      this.$set(this.effectDialog, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/update_one`, {
          table: "Followerrateb",
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
    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.rateb, "Name", x.data.Name);
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
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "Followerrateb",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.searchEnrollers({});
        }
      });
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      if (!this.rateb.isEdit && (await this.isDuplicate(this.rateb.ID))) {
        this.showError("هذا الرقم العسكري إلحاقه جاري في قاعدة البيانات");
        return;
      }
      try {
        saveItem = await this.api(
          `global/${this.rateb.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Followerrateb",
            where: !this.rateb.isEdit
              ? this.rateb
              : {
                  ID_KEY: this.rateb.ID_KEY
                },
            update: this.rateb
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
    async isDuplicate(ID) {
      ID ? ID : "";
      let data;
      data = await this.api("global/get_one", {
        table: "Followerrateb",
        where: { ID, isEnrolled: true }
      });
      if (data && data.data && data.ok) {
        console.log("data", data);
        return true;
      } else {
        return false;
      }
    },
    actionAdd() {
      this.$set(this.rateb, "isEdit", false);
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.findOne(item.ID);
      this.$set(this.createdObject, "model", true);
      this.$set(this, "rateb", {
        ...item,
        isEdit: true,
        wokel7aq: item.followerwork.wokel7aq
      });
    },
    actionCertificatie(item) {
      if (!item.isEnrolled) {
        return;
      }
      if (this.hasEditAccess()) {
        this.$confirm(`هل انت متاكد من تغير حالة الالحاق`, {
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
        table: "Followerrateb",
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
            model: "Rateb",
            where: this.cleanObject({
              SupplyingRigion: where.SupplyingRigion,
              Name: where.Name,
              RatebCategory: where.RatebCategory,
              RatebLevel: where.RatebLevel,
              Status: where.Status,
              Religion: where.Religion,
              UnitID: where.UnitID
            }),
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ]
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
