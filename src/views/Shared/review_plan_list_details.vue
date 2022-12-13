<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في خطة المراجعة"
      addBtnTitle="إضافة وحدة الى خطة المراجعة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الوحدات بداخل المراجعة'"
    >
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.actionDetails="{ item }">
        <v-chip icon color="primary" @click="actionRouteToDetails(item)">
          <v-icon>mdi-information-variant</v-icon>
        </v-chip>
      </template>
      <template v-slot:item.HighReviewed="{ item }">
        <v-chip :color="item.HighReviewed ? 'success' : 'error'">
          {{ item.HighReviewed ? `نعم` : `لا` }}
        </v-chip>
      </template>
      <template v-slot:item.TasgelReviewed="{ item }">
        <v-chip :color="item.TasgelReviewed ? 'success' : 'error'">
          {{ item.TasgelReviewed ? `نعم` : `لا` }}
        </v-chip>
      </template>
      <template v-slot:item.EnrollersReviewed="{ item }">
        <v-chip :color="item.EnrollersReviewed ? 'success' : 'error'">
          {{ item.EnrollersReviewed ? `نعم` : `لا` }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="reviewPlanListItem"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "reviewPlanListDetails",

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

  // to show and hide headers based on the user role coming from parameters

  created() {
    this.handleViewBasedOnDepartmentType();
  },
  mounted() {
    this.init();
    // this.selects.UnitID.data = this.selects.UnitID.data.filter(
    //   ele => ele.willReview
    // );

    this.findItems({});
  },

  data: () => ({
    layer: {},
    reviewPlanListItem: {},

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    searchLoading: false,

    mainTable: {
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
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },

        {
          text: "مراجعة قسم التسجيل",
          value: "TasgelReviewed",
          searchValue: "TasgelReviewed",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "ملاحظات قسم التسجيل",
          value: "TasgelNotes",
          searchValue: "TasgelNotes",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ مراجعة التسجيل",
          value: "TasgelReviewDate",
          searchValue: "TasgelReviewDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "مراجعة قسم الملحقين",
          value: "EnrollersReviewed",
          searchValue: "EnrollersReviewed",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "ملاحظات قسم الملحقين",
          value: "EnrollersNotes",
          searchValue: "EnrollersNotes",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ مراجعة الملحقين",
          value: "EnrollersReviewDate",
          searchValue: "EnrollersReviewDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "مراجعة قسم الراتب العالي",
          value: "HighReviewed",
          searchValue: "HighReviewed",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "ملاحظات قسم الراتب العالي",
          value: "HighNotes",
          searchValue: "HighNotes",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ مراجعة التسجيل",
          value: "HighReviewDate",
          searchValue: "HighReviewDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "مؤثرات الوحدة",
          value: "actionDetails",
          searchValue: "actionDetails",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 7
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    selects: {
      UnitID: {
        table: "Unit",
        text: "Unit",
        value: "UnitID"
      }
    },

    showAddDialog: false,
    addLoading: false,
    addModel: {}
  }),
  methods: {
    handleViewBasedOnDepartmentType() {
      const TasgelReviewFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "TasgelReviewed"
      );
      const TasgelNotesFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "TasgelNotes"
      );
      const EnrollersReviewFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "EnrollersReviewed"
      );
      const EnrollersNotesFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "EnrollersNotes"
      );
      const HighReviewFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "HighReviewed"
      );
      const HighNotesFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "HighNotes"
      );
      const HighReviewDateFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "HighReviewDate"
      );
      const TasgelReviewDateFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "TasgelReviewDate"
      );
      const EnrollersReviewDateFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "EnrollersReviewDate"
      );

      if (this.$route.params.departmentType == "Admin") {
        this.mainTable.headers[TasgelReviewFieldIndex].inTable = true;
        this.mainTable.headers[TasgelNotesFieldIndex].inTable = true;
        this.mainTable.headers[EnrollersReviewFieldIndex].inTable = true;
        this.mainTable.headers[EnrollersNotesFieldIndex].inTable = true;
        this.mainTable.headers[HighReviewFieldIndex].inTable = true;
        this.mainTable.headers[HighNotesFieldIndex].inTable = true;
        this.mainTable.headers[HighReviewDateFieldIndex].inTable = true;
        this.mainTable.headers[TasgelReviewDateFieldIndex].inTable = true;
        this.mainTable.headers[EnrollersReviewDateFieldIndex].inTable = true;
      }
      if (this.$route.params.departmentType == "Tasgel") {
        this.mainTable.headers[TasgelReviewFieldIndex].inTable = true;
        this.mainTable.headers[TasgelNotesFieldIndex].inTable = true;
        this.mainTable.headers[TasgelReviewDateFieldIndex].inTable = true;
      }
      if (this.$route.params.departmentType == "Enrollers") {
        this.mainTable.headers[EnrollersReviewFieldIndex].inTable = true;
        this.mainTable.headers[EnrollersNotesFieldIndex].inTable = true;
        this.mainTable.headers[EnrollersReviewDateFieldIndex].inTable = true;
      }
      if (this.$route.params.departmentType == "High") {
        this.mainTable.headers[HighReviewFieldIndex].inTable = true;
        this.mainTable.headers[HighNotesFieldIndex].inTable = true;
        this.mainTable.headers[HighReviewDateFieldIndex].inTable = true;
      }
    },

    handleAddOrEditView(isEdit) {
      const TasgelReviewFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "TasgelReviewed"
      );
      const TasgelNotesFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "TasgelNotes"
      );
      const EnrollersReviewFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "EnrollersReviewed"
      );
      const EnrollersNotesFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "EnrollersNotes"
      );
      const HighReviewFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "HighReviewed"
      );
      const HighNotesFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "HighNotes"
      );
      const HighReviewDateFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "HighReviewDate"
      );
      const TasgelReviewDateFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "TasgelReviewDate"
      );
      const EnrollersReviewDateFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "EnrollersReviewDate"
      );
      this.mainTable.headers[TasgelReviewFieldIndex].inModel = false;
      this.mainTable.headers[TasgelNotesFieldIndex].inModel = false;
      this.mainTable.headers[EnrollersReviewFieldIndex].inModel = false;
      this.mainTable.headers[EnrollersNotesFieldIndex].inModel = false;
      this.mainTable.headers[HighReviewFieldIndex].inModel = false;
      this.mainTable.headers[HighNotesFieldIndex].inModel = false;
      this.mainTable.headers[HighReviewDateFieldIndex].inModel = false;
      this.mainTable.headers[EnrollersReviewDateFieldIndex].inModel = false;
      this.mainTable.headers[TasgelReviewDateFieldIndex].inModel = false;

      if (isEdit) {
        if (this.$route.params.departmentType == "Admin") {
          this.mainTable.headers[TasgelReviewFieldIndex].inModel = true;
          this.mainTable.headers[TasgelNotesFieldIndex].inModel = true;
          this.mainTable.headers[EnrollersReviewFieldIndex].inModel = true;
          this.mainTable.headers[EnrollersNotesFieldIndex].inModel = true;
          this.mainTable.headers[HighReviewFieldIndex].inModel = true;
          this.mainTable.headers[HighNotesFieldIndex].inModel = true;
          this.mainTable.headers[HighReviewDateFieldIndex].inModel = true;
          this.mainTable.headers[EnrollersReviewDateFieldIndex].inModel = true;
          this.mainTable.headers[TasgelReviewDateFieldIndex].inModel = true;
        }
        if (this.$route.params.departmentType == "Tasgel") {
          this.mainTable.headers[TasgelReviewFieldIndex].inModel = true;
          this.mainTable.headers[TasgelNotesFieldIndex].inModel = true;
          this.mainTable.headers[TasgelReviewDateFieldIndex].inModel = true;
        }
        if (this.$route.params.departmentType == "Enrollers") {
          this.mainTable.headers[EnrollersReviewFieldIndex].inModel = true;
          this.mainTable.headers[EnrollersNotesFieldIndex].inModel = true;
          this.mainTable.headers[EnrollersReviewDateFieldIndex].inModel = true;
        }
        if (this.$route.params.departmentType == "High") {
          this.mainTable.headers[HighReviewFieldIndex].inModel = true;
          this.mainTable.headers[HighNotesFieldIndex].inModel = true;
          this.mainTable.headers[HighReviewDateFieldIndex].inModel = true;
        }
      }
    },
    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        if (this.$route.params.departmentType == "High") {
          this.$set(
            this.reviewPlanListItem,
            "HighReviewer",
            this.$store.state.currentUser.realName
          );
        }
        if (this.$route.params.departmentType == "Tasgel") {
          this.$set(
            this.reviewPlanListItem,
            "TasgelReviewer",
            this.$store.state.currentUser.realName
          );
        }
        if (this.$route.params.departmentType == "Enrollers") {
          this.$set(
            this.reviewPlanListItem,
            "EnrllersReviewer",
            this.$store.state.currentUser.realName
          );
        }

        let saveItem;
        this.$set(
          this.reviewPlanListItem,
          "reviewPlanID",
          this.$route.params.id
        );
        saveItem = await this.api(
          this.reviewPlanListItem.isEdit
            ? "global/update_one"
            : "global/create_one",
          {
            table: "reviewPlanListDetails",
            where: !this.reviewPlanListItem.isEdit
              ? this.reviewPlanListItem
              : {
                  ID_KEY: this.reviewPlanListItem.ID_KEY
                },
            update: this.reviewPlanListItem
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems(this.search);
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

    // to make unit  and  review date editable here

    actionAdd() {
      const UnitFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Unit.Unit"
      );
      this.mainTable.headers[UnitFieldIndex].readOnly = false;
      this.handleAddOrEditView(false);
      this.$set(this, "reviewPlanListItem", {});
      this.$set(this.createdObject, "model", true);
    },

    findItems(filters) {
      console.log("id", this.$route.params.id);
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [""],
        multi = [""];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "reviewPlanListDetails",
        include: [
          {
            model: "reviewPlanList"
          },
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          reviewPlanID: this.$route.params.id
        })
      })
        .then(async x => {
          try {
            this.$set(this.mainTable, "items", x.data);
            this.$set(this.mainTable, "printer", {
              data: this.mainTable.items,
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable),
              hasParent: true
            });
          } catch (e) {
            console.log(e);
          }
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    // to make unit  and  reviwe date readonly here

    actionRouteToDetails(item) {
      this.$router.push(`/UnitEffectsDetails/${item.UnitID}`);
    },
    actionEdit(item) {
      const UnitFieldIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Unit.Unit"
      );
      this.mainTable.headers[UnitFieldIndex].readOnly = true;

      this.$set(this, "reviewPlanListItem", {
        ...item,
        isEdit: true
      });
      this.handleAddOrEditView(true);

      this.$set(this.createdObject, "model", true);
    }
  }
};
</script>
