<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :loading="searchLoading"
      @on-search="findAllCourses"
      @on-add="actionAdd()"
      :clearOption="true"
      :search="search"
      title="بحث متقدم "
      :addButton="true"
      addBtnTitle="إضافة دورة أو فرقة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'دورات والفرق'"
      :printer="mainTable.printer"
    >
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteOfficer(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="course"
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
  name: "OfficerCoursesManagement",
  mounted() {
    this.init();
    const weekInMls = 7 * 24 * 60 * 60 * 1000;

    this.search.Date = [
      this.formatDate(new Date())
      // this.formatDate(new Date(new Date().getTime() + weekInMls))
    ];
    this.findAllCourses(this.search);
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    course: {},
    searchLoading: false,
    search: {},
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
          text: "الشعبة",
          value: "MilitaryManagementOfficer.Branch.Name",
          searchValue: "BranchID",
          type: "select",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "الرقم العسكري",
          value: "MilitaryManagementOfficer.ID",
          searchValue: "ID",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          readOnly: true,
          inSearch: true
        },
        {
          text: "الاسم",
          value: "MilitaryManagementOfficer.Name",
          searchValue: "OfficerName",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "الرتبة",
          value: "MilitaryManagementOfficer.OfficerLevel",
          searchValue: "OfficerLevel",
          type: "select",
          inTable: true,
          inModel: false,
          inSearch: true
        },
        {
          text: "دورة أو فرقة",
          value: "Course.Name",
          searchValue: "CourseID",
          type: "select",
          inTable: true,
          inModel: true,
          required: true,
          inSearch: true
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "التاريخ من",
          value: "DateFrom",
          searchValue: "DateFrom",
          multiple: false,
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          parent: "",
          sort: 1
        },
        {
          text: "التاريخ الى",
          value: "DateTo",
          searchValue: "DateTo",
          multiple: false,
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          parent: "",
          sort: 1
        },
        {
          text: "التاريخ ",
          value: "Date",
          searchValue: "Date",
          multiple: false,
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: false,
          inModel: false,
          parent: "",
          sort: 1
        }
        // {
        //   text: "الرقم القومي",
        //   value: "IdentityNo",
        //   searchValue: "IdentityNo",
        //   type: "text",
        //   inTable: true,
        //   required: false,
        //   inModel: true,
        //   inSearch: false
        // },
        // {
        //   text: "رقم التليفون",
        //   value: "PhoneNumber",
        //   searchValue: "PhoneNumber",
        //   type: "text",
        //   inTable: true,
        //   required: false,
        //   inModel: true,
        //   inSearch: false
        // }
      ],
      items: [],
      printer: []
    },
    selects: {
      OfficerCategory: {
        text: "text",
        value: "text",
        data: constants.OfficerCategory.data
      },
      OfficerLevel: {
        text: "text",
        value: "text",
        data: [
          "ملازم",
          "ملازم أ",
          "نقيب",
          "رائد",
          "رائد أ ح",
          "مقدم",
          "مقدم أ ح",
          "عقيد",
          "عقيد أ ح",
          "عميد",
          "عميد أ ح",
          "لواء",
          "لواء أ ح",
          "فريق",
          "فريق أ ح"
        ]
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      OfficerName: {
        table: "MilitaryManagementOfficers",
        text: "Name",
        value: "ID"
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      BranchID: {
        table: "Branches",
        text: "Name",
        value: "ID_KEY"
      },
      CourseID: {
        table: "Courses",
        text: "Name",
        value: "ID_KEY"
      },
      Status: {
        text: "text",
        value: "text",
        data: [{ text: "بالخدمة" }, { text: "منتهى خدمته" }]
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
    "course.OfficerName"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    findOne(ID) {
      if (ID.length > 1) {
        this.api("global/get_one", {
          table: "MilitaryManagementOfficers",
          where: { ID }
        })
          .then(x => {
            console.log(x);
            this.$set(this.course, "ID", x.data.ID);
          })
          .catch(error => {})
          .finally(() => {});
      }
    },

    async findAllCourses(filters) {
      // this.search = [...filters];
      if (!filters.Date.length > 0) {
        return this.showError("يرجى إختيار تاريخ من إلى أولا");
      }
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        multi = [],
        dates = [];
      try {
        const result = await this.api("global/get_all", {
          where: this.mapToQuery(
            this.cleanObject({
              ...where,
              Date: null,
              DateFrom: null,
              DateTo: null
            }),
            likes,
            multi,
            dates
          ),

          table: "OfficerCourses",
          include: [
            {
              model: "MilitaryManagementOfficers",
              include: [{ model: "Branches" }]
            },
            {
              model: "Courses"
            }
          ]
        });
        let items = result.data;
        console.log(items);
        if (filters.Date.length > 0) {
          items = items.filter(ele => {
            let hasToAndFromDate =
              new Date(filters.Date[1]) <= new Date(ele.DateTo) &&
              new Date(ele.DateFrom) <= new Date(filters.Date[0]);
            let hasOnlyFromDate =
              new Date(ele.DateFrom) <= new Date(filters.Date[0]) &&
              new Date(filters.Date[0]) <= new Date(ele.DateTo);
            return !filters.Date[1] ? hasOnlyFromDate : hasToAndFromDate;
          });
        }
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
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      if (await this.checkIfOfficerNotAvailable(this.course)) {
        return this.showError(`هذا الفرد له التزام اخر`);
      }
      try {
        saveItem = await this.api(
          !this.course.isEdit ? `global/create_one` : `global/update_one`,
          {
            table: "OfficerCourses",
            where: !this.course.isEdit
              ? this.course
              : {
                  ID_KEY: this.course.ID_KEY
                },
            update: this.course
          }
        );
        if (saveItem && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findAllCourses(this.search);
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
      this.$set(this, "course", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "course", {
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
          table: "OfficerCourses",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findAllCourses(this.search);
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
