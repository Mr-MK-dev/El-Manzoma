<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="searchFollowers"
      @on-add="actionAdd"
      :clearOption="true"
      :search="search"
      title="بحث متقدم فالملحقين"
      addBtnTitle="إضافة الحاق"
    />
    <table-bulider
      :isExcel="true"
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
      </template>
      <template v-slot:item.isEnrolled="{ item }">
        <v-chip
          @click="ActionEndEnrollment(item)"
          :color="item.isEnrolled == 1 ? 'success' : 'error'"
        >
          {{ item.isEnrolled ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.SuputerPath="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
            v-for="(file, index) of item.ArchivedFiles"
            class="mx-auto"
            :key="file"
            large
            @click="openFile(file, item.ArchiveData)"
            outlined
            color="primary"
          >
            عرض الملف رقم ({{ index + 1 }})
          </v-btn>
        </div>
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
      <template v-slot:item.isIllegal="{ item }">
        <v-chip :color="item.isIllegal == 1 ? 'success' : 'error'">
          {{ item.isIllegal ? "نعم" : "لا" }}
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
      :data="enrollers"
      @on-submit="saveItem()"
      @on-close="
        createdObject.model = false;
        init();
      "
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
    <editor-dialog-bulider
      :title="'إختيار النوع'"
      :open="TypeObject.model"
      :loading="TypeObject.loading"
      :fields="KindEditor.headers"
      :selects="selects"
      :data="preEditor"
      @on-submit="CompleteEditorData()"
      @on-close="TypeObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "enrollers",
  mounted() {
    this.init();
    this.getRecuEndDateOptions();
    this.checkIfEnrolledAfterEnrollDate();
  },
  data: () => ({
    TypeObject: {
      model: false,
      loading: false,
      item: {}
    },
    preEditor: {},
    KindEditor: {
      headers: [
        {
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
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
          required: true,
          sort: 1
        }
      ]
    },
    enrollers: {},
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
          text: "السلاح",
          value: "Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "التجميعات القتالية",
          value: "Collections",
          searchValue: "CollectionID",
          sortable: true,
          type: "select",
          multiple: false,
          inSearch: true,
          inTable: false,
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
          text: "التصنيف",
          value: "followerwork.wokel7aq",
          searchValue: "wokel7aq",
          sortable: true,
          type: "select",
          multiple: true,
          notMultipleInModel: true,
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
          multiple: true,
          notMultipleInModel: true,
          inSearch: true,
          inTable: true,
          inModel: true
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
          type: "select",
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
          type: "select",
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
          type: "select",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: true,
          readonly: false,
          sort: 1
        },
        // {
        //   text: "أمر مهمة تدريب",
        //   value: "isTrainingOrder",
        //   searchValue: "isTrainingOrder",
        //   type: "select",
        //   sortable: true,
        //   inTable: true,
        //   inModel: true,
        //   inSearch: true,
        //   readonly: false,
        //   sort: 1
        // },
        {
          text: "غير قانوني",
          value: "isIllegal",
          searchValue: "isIllegal",
          type: "select",
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
          text: "تاريخ التنبيه",
          value: "AlarmDate",
          searchValue: "AlarmDate",
          type: "date",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: true,
          sort: 1
        },
        {
          text: "الملاحظات التنبيه",
          value: "AlarmNotes",
          searchValue: "AlarmNotes",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
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
        },
        {
          text: "مكان ملف المؤيد",
          value: "SuputerPath",
          searchValue: "SuputerPath",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: false
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
      isEnrolled: {
        text: "text",
        value: "value",
        data: [
          { text: "نعم", value: 1 },
          { text: "لا", value: 0 }
        ]
      },
      isRecommended: {
        text: "text",
        value: "value",
        data: [
          { text: "نعم", value: 1 },
          { text: "لا", value: 0 }
        ]
      },
      isSelected: {
        text: "text",
        value: "value",
        data: [
          { text: "نعم", value: 1 },
          { text: "لا", value: 0 }
        ]
      },
      isTrainingOrder: {
        text: "text",
        value: "value",
        data: [
          { text: "نعم", value: 1 },
          { text: "لا", value: 0 }
        ]
      },
      isIllegal: {
        text: "text",
        value: "value",
        data: [
          { text: "نعم", value: 1 },
          { text: "لا", value: 0 }
        ]
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
      wokel7aq: {
        table: "followerwork",
        value: "wokel7aq",
        text: "wokel7aq"
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
        value: "text",
        text: "text",
        data: constants.SoldierStatus.data
      },

      CollectionID: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      WeaponID: {
        table: "Weapon",
        value: "WeaponID",
        text: "Weapon"
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
    async "enrollers.wokel7aq"(newValue) {
      this.selects.workplace.data = this.selects.allWorkplace.data.filter(
        ele => ele.wokel7aq == newValue
      );
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
    async checkIfEnrolledAfterEnrollDate() {
      let data = [];
      try {
        let soldier = await this.api(`global/get_all`, {
          table: "followersolider",
          where: { $or: { isEnrolled: true } }
        });
        let rateb = await this.api(`global/get_all`, {
          table: "Followerrateb",
          where: { $or: { isEnrolled: true } }
        });

        data = [...soldier.data, ...rateb.data];

        let check = data.filter(
          ele => new Date() >= new Date(ele.AlarmDate) && ele.AlarmDate
        );
        if (check.length > 0)
          return this.showError(
            "هناك ملحقين إنتهى تاريخ إلحاقهم ولم يتم حذف الإلحاق"
          );
      } catch (e) {
        this.handleError(e);
      }
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: `${
              item.Type == "مجند" ? "followersolider" : "Followerrateb"
            }`,

            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.searchFollowers(this.search);
        }
      });
    },
    async ActionOpenFile(item) {
      let file = await this.api(`global/get_all`, {
        table: "ArchiveFileFollowers",
        include: [
          {
            model: "FollowerArchiveFiles"
          }
        ],
        where: { ID: item.ID }
      });

      if (file.data.length > 0) {
        console.log("file path", file);
        await this.api("global/open_file", {
          path: file.data[0].FollowerArchiveFile.FilePath
        });
      } else {
        this.showError("لا يوجد له ملف");
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
          table: `${
            this.effect.Type == "مجند" ? "followersolider" : "Followerrateb"
          }`,
          where: { ID_KEY: this.effect.ID_KEY },
          update: this.effect
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.searchFollowers(this.search);
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

      if (
        !this.enrollers.isEdit &&
        (await this.isDuplicate(this.enrollers.ID, this.enrollers.Type))
      ) {
        this.showError("هذا الرقم العسكري تم إلحاقه بالفعل");
        return;
      }
      if (this.enrollers.AlarmDate) {
        if (new Date(this.enrollers.AlarmDate) <= new Date()) {
          return this.showError(
            "تاريخ التنبيه خاطىء يرجى كتابة تاريخ التنبيه الصحيح"
          );
        }
      }
      try {
        saveItem = await this.api(
          `global/${this.enrollers.isEdit ? "update_one" : "create_one"}`,
          {
            table: `${
              this.enrollers.Type == "مجند"
                ? "followersolider"
                : "Followerrateb"
            }`,
            where: !this.enrollers.isEdit
              ? this.enrollers
              : {
                  ID_KEY: this.enrollers.ID_KEY
                },
            update: this.enrollers
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.searchFollowers(this.search);
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
    findSoldier(ID) {
      console.log("finding s");
      if (ID.length > 10) {
        this.$set(this.createdObject, "loading", true);

        this.api("global/get_one", {
          table: "Soldier",
          where: { ID }
        })
          .then(x => {
            this.$set(this.enrollers, "Name", x.data.Name);
          })
          .catch(error => {
            this.$set(this.enrollers, "Name", "");
          })
          .finally(() => {
            this.$set(this.createdObject, "loading", false);
          });
        this.$set(this.createdObject, "model", true);
        this.$set(this.createdObject, "loading", false);
      }
    },
    findRateb(ID) {
      console.log("finding r", ID);
      if (ID.length > 10) {
        this.$set(this.createdObject, "loading", true);

        this.api("global/get_one", {
          table: "Rateb",
          where: { ID }
        })
          .then(x => {
            this.$set(this.enrollers, "Name", x.data.Name);
          })
          .catch(error => {
            this.$set(this.enrollers, "Name", "");
          })
          .finally(() => {
            this.$set(this.createdObject, "loading", false);
          });
        this.$set(this.createdObject, "model", true);
        this.$set(this.createdObject, "loading", false);
      }
    },
    actionAdd() {
      this.$set(this, "enrollers", { isEdit: false });
      this.$set(this, "preEditor", {});

      this.$set(this.createdObject, "item", {});
      this.$set(this.TypeObject, "model", true);
    },
    CompleteEditorData() {
      this.$set(this.TypeObject, "model", false);
      this.$set(this.createdObject, "loading", true);

      if (this.preEditor.Type == "مجند") {
        this.findSoldier(this.preEditor.ID);
      } else if (this.preEditor.Type == "راتب عالى") {
        this.findRateb(this.preEditor.ID);
      }
      this.$set(this.enrollers, "ID", this.preEditor.ID);
      this.$set(this.enrollers, "Type", this.preEditor.Type);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "enrollers", {
        ...item,
        isEdit: true,
        wokel7aq: item.followerwork.wokel7aq
      });
    },

    ActionEndEnrollment(item) {
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
    async isDuplicate(ID, Type) {
      ID ? ID : "";
      let data;
      data = await this.api("global/get_one", {
        table: `${Type == "مجند" ? "followersolider" : "Followerrateb"}`,
        where: { ID, isEnrolled: true }
      });
      if (data && data.data && data.ok) {
        console.log("data", data);
        return true;
      } else {
        return false;
      }
    },
    async searchFollowers(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      if (!filters?.Type?.length) {
        this.showError("برجاء اختيار نوع الفرد الملحق");
        return;
      }
      if (this.search.CollectionID) {
        console.log(this.search.CollectionID);
        let data = await this.api("global/get_all", {
          table: "UnitCollectionPivot",
          where: { CollectionId: this.search.CollectionID }
        });
        console.log(data);
        // this.$set(this.search, "UnitID", data.data.map(ele => ele.UnitID));
        filters.UnitID = data.data.map(ele => ele.UnitID);
        // this.search.Collections = {};
        console.log(data.data.map(ele => ele.UnitID));
      }
      this.$set(this, "search", { ...filters });
      this.api("sections/tasgeel/search/enrollers", {
        search: this.cleanObject({
          ...filters,
          // CollectionID: null,
          RatebCategory: filters.Category,
          RatebLevel: filters.Level,
          SoldierCategory: filters.Category,
          SoldierLevel: filters.Level
        })
      })
        .then(x => {
          let fixedData = x.data.map(ele => {
            let file = (ele?.Soldier || ele?.Rateb).ArchiveFileFollowers[0]
              ?.FollowerArchiveFile?.FilePath;
            return {
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
              Weapon:
                ele?.Soldier?.Weapon?.Weapon || ele?.Rateb?.Weapon?.Weapon,
              ArchivedFiles: file?.includes("[")
                ? JSON.parse(file)
                : file
                ? [file]
                : [],
              ArchiveData: (ele?.Soldier || ele?.Rateb).ArchiveFileFollowers[0]
                ?.FollowerArchiveFile
            };
          });
          fixedData = lodash.sortBy(fixedData, [
            "followerwork.ordernum",
            "TarekhElhak"
          ]);

          let printer = {
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
          this.init();
        });
    },
    async openFile(filePath, item) {
      let file = await this.api("global/copy_file_to_printer", {
        FilePath: filePath,
        ArchiveNum: item.ArchiveNum,
        SequenceNum: item.SequenceNum
      });

      console.log("file", filePath);

      await this.api("global/open_file", {
        path: file.data
      });
    }
  }
};
</script>
