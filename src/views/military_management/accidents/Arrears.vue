<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :loading="searchLoading"
      @on-search="findAllAccidents"
      :search="search"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الحوادث "
      :addButton="false"
      addBtnTitle="إضافة حادثة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'الحوادث'"
      :printer="mainTable.printer"
    >
      <template v-slot:item.Details="{ item }">
        <v-chip
          color="primary"
          @click="openTextDialog(item, 'Details', 'تفاصيل الموضوع')"
          depressed
        >
          {{ "التفاصيل" }}
        </v-chip>
      </template>
      <template v-slot:item.Summary="{ item }">
        <v-chip
          color="primary"
          @click="openTextDialog(item, 'Summary', 'ملخص الحادث')"
          depressed
        >
          {{ "ملخص الحادث" }}
        </v-chip>
      </template>
      <template v-slot:item.DecisionMade="{ item }">
        <v-chip
          color="primary"
          @click="openTextDialog(item, 'DecisionMade', 'الإجراء المتخذ')"
          depressed
        >
          {{ "الإجراء المتخذ" }}
        </v-chip>
      </template>
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteOfficer(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.humanLoss="{ item }">
        <v-btn @click="routeToHumanLoss(item)" large outlined color="primary">
          خسائر بشرية
        </v-btn>
      </template>
      <template v-slot:item.otherLoss="{ item }">
        <v-btn @click="routeToOtherLoss(item)" large outlined color="primary">
          خسائر اخرى
        </v-btn>
      </template>
    </table-bulider>
    <v-dialog
      scrollable
      :fullscreen="textDialog.fullscreen"
      v-model="textDialog.model"
      max-width="650"
    >
      <v-card>
        <v-card-title>
          {{ textDialog.title }}
          <v-spacer></v-spacer>
          <v-btn icon @click="textDialog.fullscreen = !textDialog.fullscreen">
            <v-icon
              >mdi-window-{{
                textDialog.fullscreen ? "restore" : "maximize"
              }}</v-icon
            >
          </v-btn>
          <v-btn icon @click="textDialog.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <dynamic-link
            :prefix="['@', '#']"
            :text="textDialog.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          ></dynamic-link>
        </v-card-text>
      </v-card>
    </v-dialog>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="accident"
      :selects="selects"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../../Constant").default;
export default {
  name: "Arrears",
  async mounted() {
    await this.init();
    await this.findAllAccidents(this.search);
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    accident: {},
    searchLoading: false,
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },

    mainTable: {
      headers: [
        {
          text: "",
          value: "edit",
          searchValue: "edit",
          sortable: false,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "تصنيف الحادث",
          value: "accidentType.accidentCategory.Name",
          searchValue: "CategoryID",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "نوع الحادث",
          value: "accidentType.Name",
          searchValue: "TypeID",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "ملخص الحادث",
          value: "Summary",
          searchValue: "Summary",
          type: "textarea",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "تفاصيل الحادث",
          value: "Details",
          searchValue: "Details",
          type: "textarea",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "أسباب الحادث",
          value: "Reason",
          searchValue: "Reason",
          type: "textarea",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "الإجراء المتخذ",
          value: "DecisionMade",
          searchValue: "DecisionMade",
          type: "textarea",
          inTable: true,
          inModel: true,
          inSearch: false
        },
        {
          text: "تاريخ وقوع الحادث",
          value: "DateOfAccident",
          searchValue: "DateOfAccident",
          type: "date",
          inTable: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "تاريخ الإبلاغ",
          value: "DateOfReporting",
          searchValue: "DateOfReporting",
          type: "date",
          inTable: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "تاريخ اخر متابعة",
          value: "DateOfLastFollow",
          searchValue: "DateOfLastFollow",
          type: "date",
          inTable: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "تاريخ اخر رد",
          value: "DateOfLastReply",
          searchValue: "DateOfLastReply",
          type: "date",
          inTable: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "من فضلك اختار الإجراءات المتخذة",
          searchTitle: "الإجراءات والمتابعة",
          type: "title",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "مذكرة تفصيلية",
          value: "isDetailedNoteText",
          searchValue: "isDetailedNote",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "محضر شرطة عسكرية",
          value: "isMilitaryPoliceRecordText",
          searchValue: "isMilitaryPoliceRecord",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "محضر شرطة مدنية",
          value: "isCivilPoliceRecordText",
          searchValue: "isCivilPoliceRecord",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "التصرف النهائي للسلطة القضائية",
          value: "isFinalActOfJusticeText",
          searchValue: "isFinalActOfJustice",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "إخطار هيئة التنظيم والإدارة",
          value: "isOrganizationReportedText",
          searchValue: "isOrganizationReported",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "مجلس تحقيق",
          value: "isInvestigationCouncilText",
          searchValue: "isInvestigationCouncil",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "امر تنفيذ الحكم",
          value: "isJudgmentOrderDoneText",
          searchValue: "isJudgmentOrderDone",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "إعلان الحكم",
          value: "isJudgmentPublicText",
          searchValue: "isJudgmentPublic",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "مستخرج الحكم",
          value: "isJudgmentOutputText",
          searchValue: "isJudgmentOutput",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "161 س",
          value: "S161Text",
          searchValue: "S161",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "ابرز الحوادث",
          value: "isNotableAccidentText",
          searchValue: "isNotableAccident",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "الحادث متابع",
          value: "isFollowedText",
          searchValue: "isFollowed",
          type: "checkbox",
          inTable: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "خسائر بشرية",
          value: "humanLoss",
          searchValue: "humanLoss",
          type: "text",
          inTable: true,
          inModel: false,
          inSearch: false
        },
        {
          text: "خسائر اخرى",
          value: "otherLoss",
          searchValue: "otherLoss",
          type: "text",
          inTable: true,
          inModel: false,
          inSearch: false
        }
      ],
      items: [],
      printer: []
    },
    search: {},
    selects: {
      UnitID: {
        table: "Unit",
        text: "Unit",
        value: "UnitID"
      },
      TypeID: {
        table: "accidentTypes",
        text: "Name",
        value: "ID_KEY"
      },
      CategoryID: {
        table: "accidentCategories",
        text: "Name",
        value: "ID_KEY"
      },
      allTypes: {
        table: "accidentTypes",
        text: "Name",
        value: "ID_KEY"
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
    async "accident.CategoryID"(newValue) {
      this.selects.TypeID.data = this.selects.allTypes.data.filter(
        ele => ele.CategoryID == newValue
      );
    },
    "search.CategoryID"(val) {
      this.selects.TypeID.data = this.selects.allTypes.data.filter(
        ele => ele.CategoryID == val
      );
    }
  },
  methods: {
    async findAllAccidents(filters) {
      // this.search = [...filters];

      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
          ...filters
        },
        likes = ["Details", "Summary"],
        multi = [],
        dates = [
          "DateOfAccident",
          "DateOfReporting",
          "DateOfLastFollow",
          "DateOfLastReply"
        ];
      try {
        const result = await this.api("global/get_all", {
          where: this.mapToQuery(
            this.cleanObject({
              ...where,
              CategoryID: null,
              $or: [
                { isDetailedNote: false },
                { isMilitaryPoliceRecord: false },
                { isCivilPoliceRecord: false },
                { isFinalActOfJustice: false },
                { isOrganizationReported: false },
                { isInvestigationCouncil: false },
                { isJudgmentOrderDone: false },
                { isJudgmentPublic: false },
                { isJudgmentOutput: false },
                { S161: false },
                { isNotableAccident: false },
                { isFollowed: false }
              ]
            }),
            likes,
            multi,
            dates
          ),

          table: "Accidents",
          include: [
            {
              model: "accidentTypes",
              include: [
                {
                  model: "accidentCategories"
                }
              ],
              where: this.cleanObject({
                CategoryID: filters.CategoryID
              })
            },
            {
              model: "Unit"
            }
          ]
        });
        console.log(
          "where",
          this.mapToQuery(
            this.cleanObject({
              ...where
            }),
            likes,
            multi,
            dates
          )
        );
        console.log("data", result.data);
        let items = result.data.map(ele => ({
          ...ele,
          CategoryID: ele.accidentType.CategoryID,
          isDetailedNoteText: ele.isDetailedNote ? "نعم" : "لا",
          isMilitaryPoliceRecordText: ele.isMilitaryPoliceRecord ? "نعم" : "لا",
          isCivilPoliceRecordText: ele.isCivilPoliceRecord ? "نعم" : "لا",
          isFinalActOfJusticeText: ele.isFinalActOfJustice ? "نعم" : "لا",
          isOrganizationReportedText: ele.isOrganizationReported ? "نعم" : "لا",
          isInvestigationCouncilText: ele.isInvestigationCouncil ? "نعم" : "لا",
          isJudgmentOrderDoneText: ele.isJudgmentOrderDone ? "نعم" : "لا",
          isJudgmentPublicText: ele.isJudgmentPublic ? "نعم" : "لا",
          isJudgmentOutputText: ele.isJudgmentOutput ? "نعم" : "لا",
          S161Text: ele.S161 ? "نعم" : "لا",
          isNotableAccidentText: ele.isNotableAccident ? "نعم" : "لا",
          isFollowedText: ele.isFollowed ? "نعم" : "لا"
        }));
        console.log(items);
        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "searchLoading", false);
    },
    openTextDialog(item, modelToOpen, title) {
      this.$set(this.textDialog, "title", `${title}`);
      this.$set(this.textDialog, "text", item[modelToOpen]);
      this.$set(this.textDialog, "model", true);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      try {
        saveItem = await this.api(
          !this.accident.isEdit ? `global/create_one` : `global/update_one`,
          {
            table: "Accidents",
            where: !this.accident.isEdit
              ? this.accident
              : {
                  ID_KEY: this.accident.ID_KEY
                },
            update: this.accident
          }
        );
        if (saveItem && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findAllAccidents(this.search);
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

    actionAdd() {
      this.$set(this, "accident", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "accident", {
        ...item,
        OfficerName: item.ID,
        BranchID: item.Officer?.BranchID,
        isEdit: true
      });
    },

    async deleteOfficer(item) {
      this.$set(this.del, "loading", true);

      // here will create all attached units with null
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "Accidents",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.findAllAccidents(this.search);
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    },
    routeToOtherLoss(item) {
      this.$router.push(`OtherLoss/${item.ID_KEY}`);
    },
    routeToHumanLoss(item) {
      this.$router.push(`HumanLoss/${item.ID_KEY}`);
    }
  }
};
</script>
